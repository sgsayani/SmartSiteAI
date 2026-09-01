import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { generateProjectName, generateWebsite } from "../lib/ai.js";
import { CREDITS_PER_GENERATION } from "../lib/credits.js";

const router = Router();

router.use(requireAuth);

router.get("/credits", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { credits: true },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ credits: user.credits });
  } catch (error) {
    console.error("GET /api/user/credits", error);
    res.status(500).json({ message: "Could not load credits" });
  }
});

router.get("/projects", async (req, res) => {
  try {
    const projects = await prisma.websiteProject.findMany({
      where: { userId: req.userId },
      orderBy: { updatedAt: "desc" },
      include: { versions: true, conversation: { orderBy: { timestamp: "asc" } } },
    });

    res.json({ projects });
  } catch (error) {
    console.error("GET /api/user/projects", error);
    res.status(500).json({ message: "Could not load projects" });
  }
});

router.get("/projects/:projectId", async (req, res) => {
  try {
    const project = await prisma.websiteProject.findFirst({
      where: { id: req.params.projectId, userId: req.userId },
      include: {
        versions: { orderBy: { timestamp: "asc" } },
        conversation: { orderBy: { timestamp: "asc" } },
      },
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json({ project });
  } catch (error) {
    console.error("GET /api/user/projects/:projectId", error);
    res.status(500).json({ message: "Could not load project" });
  }
});

/**
 * Generation takes minutes, far longer than a request should stay open, so the
 * project row is returned immediately with an empty `current_code` and filled in
 * by a background task. The client polls until `current_code` appears.
 */
router.post("/projects", async (req, res) => {
  const initialPrompt = String(req.body?.initial_prompt ?? "").trim();

  if (!initialPrompt) {
    return res.status(400).json({ message: "Please describe your website" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { credits: true },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.credits < CREDITS_PER_GENERATION) {
      return res.status(403).json({
        message: "Not enough credits. Purchase more to keep creating.",
      });
    }

    const name = await generateProjectName(initialPrompt);

    // Charge and create together so a failure can never bill without a project.
    const project = await prisma.$transaction(async (tx) => {
      const created = await tx.websiteProject.create({
        data: {
          name,
          initial_prompt: initialPrompt,
          userId: req.userId!,
          conversation: { create: { role: "user", content: initialPrompt } },
        },
      });

      await tx.user.update({
        where: { id: req.userId },
        data: {
          credits: { decrement: CREDITS_PER_GENERATION },
          totalCreation: { increment: 1 },
        },
      });

      return created;
    });

    res.json({ projectId: project.id });

    void buildInitialSite(project.id, initialPrompt, req.userId!);
  } catch (error) {
    console.error("POST /api/user/projects", error);
    res.status(500).json({ message: "Could not start generation" });
  }
});

const buildInitialSite = async (
  projectId: string,
  prompt: string,
  userId: string
) => {
  try {
    const code = await generateWebsite(prompt);

    const version = await prisma.version.create({
      data: { code, description: "Initial generation", projectId },
    });

    await prisma.websiteProject.update({
      where: { id: projectId },
      data: {
        current_code: code,
        current_version_index: version.id,
        conversation: {
          create: {
            role: "assistant",
            content: "Your website is ready. Ask for any changes you'd like.",
          },
        },
      },
    });
  } catch (error) {
    console.error(`Generation failed for project ${projectId}:`, error);

    await prisma.$transaction([
      prisma.conversation.create({
        data: {
          role: "assistant",
          content:
            "Generation failed. Your credits have been refunded — please try again.",
          projectId,
        },
      }),
      // The user got nothing, so they should not be charged for it.
      prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: CREDITS_PER_GENERATION } },
      }),
    ]);
  }
};

router.get("/publish-toggle/:projectId", async (req, res) => {
  try {
    const project = await prisma.websiteProject.findFirst({
      where: { id: req.params.projectId, userId: req.userId },
      select: { id: true, isPublished: true, current_code: true },
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    if (!project.isPublished && !project.current_code) {
      return res
        .status(400)
        .json({ message: "Wait for the website to finish generating" });
    }

    await prisma.websiteProject.update({
      where: { id: project.id },
      data: { isPublished: !project.isPublished },
    });

    res.json({
      message: project.isPublished ? "Project unpublished" : "Project published",
    });
  } catch (error) {
    console.error("GET /api/user/publish-toggle/:projectId", error);
    res.status(500).json({ message: "Could not change publish state" });
  }
});

router.post("/purchase-credits", async (_req, res) => {
  // No payment provider is wired up yet. Fail loudly rather than handing the
  // browser a link that goes nowhere.
  res.status(503).json({
    message:
      "Payments are not configured yet. Add a payment provider to enable credit purchases.",
  });
});

export default router;
