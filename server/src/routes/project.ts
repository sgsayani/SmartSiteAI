import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { reviseWebsite } from "../lib/ai.js";
import { CREDITS_PER_GENERATION } from "../lib/credits.js";

const router = Router();

/* ---------- public routes (no session required) ---------- */

router.get("/published", async (_req, res) => {
  try {
    const projects = await prisma.websiteProject.findMany({
      where: { isPublished: true },
      orderBy: { updatedAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        versions: true,
        conversation: { orderBy: { timestamp: "asc" } },
      },
    });

    res.json({ projects });
  } catch (error) {
    console.error("GET /api/project/published", error);
    res.status(500).json({ message: "Could not load community projects" });
  }
});

router.get("/published/:projectId", async (req, res) => {
  try {
    const project = await prisma.websiteProject.findFirst({
      where: { id: req.params.projectId, isPublished: true },
      select: { current_code: true },
    });

    if (!project) {
      return res.status(404).json({ message: "Published project not found" });
    }

    res.json({ code: project.current_code ?? "" });
  } catch (error) {
    console.error("GET /api/project/published/:projectId", error);
    res.status(500).json({ message: "Could not load project" });
  }
});

/* ---------- owner-only routes ---------- */

router.use(requireAuth);

router.get("/preview/:projectId", async (req, res) => {
  try {
    const project = await prisma.websiteProject.findFirst({
      where: { id: req.params.projectId, userId: req.userId },
      include: { versions: { orderBy: { timestamp: "asc" } } },
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json({ project });
  } catch (error) {
    console.error("GET /api/project/preview/:projectId", error);
    res.status(500).json({ message: "Could not load preview" });
  }
});

router.put("/save/:projectId", async (req, res) => {
  const code = String(req.body?.code ?? "");

  if (!code.trim()) {
    return res.status(400).json({ message: "Nothing to save" });
  }

  try {
    const project = await prisma.websiteProject.findFirst({
      where: { id: req.params.projectId, userId: req.userId },
      select: { id: true },
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    // Every save is a restorable point, so record a version alongside the code.
    const version = await prisma.version.create({
      data: { code, description: "Manual edit", projectId: project.id },
    });

    await prisma.websiteProject.update({
      where: { id: project.id },
      data: { current_code: code, current_version_index: version.id },
    });

    res.json({ message: "Project saved" });
  } catch (error) {
    console.error("PUT /api/project/save/:projectId", error);
    res.status(500).json({ message: "Could not save project" });
  }
});

router.delete("/:projectId", async (req, res) => {
  try {
    const { count } = await prisma.websiteProject.deleteMany({
      where: { id: req.params.projectId, userId: req.userId },
    });

    if (!count) return res.status(404).json({ message: "Project not found" });

    res.json({ message: "Project deleted" });
  } catch (error) {
    console.error("DELETE /api/project/:projectId", error);
    res.status(500).json({ message: "Could not delete project" });
  }
});

router.get("/rollback/:projectId/:versionId", async (req, res) => {
  try {
    const version = await prisma.version.findFirst({
      where: {
        id: req.params.versionId,
        projectId: req.params.projectId,
        project: { userId: req.userId },
      },
    });

    if (!version) return res.status(404).json({ message: "Version not found" });

    await prisma.websiteProject.update({
      where: { id: version.projectId },
      data: {
        current_code: version.code,
        current_version_index: version.id,
      },
    });

    res.json({ message: "Rolled back to selected version" });
  } catch (error) {
    console.error("GET /api/project/rollback/:projectId/:versionId", error);
    res.status(500).json({ message: "Could not roll back" });
  }
});

router.post("/revision/:projectId", async (req, res) => {
  const instruction = String(req.body?.message ?? "").trim();

  if (!instruction) {
    return res.status(400).json({ message: "Please describe the change" });
  }

  try {
    const project = await prisma.websiteProject.findFirst({
      where: { id: req.params.projectId, userId: req.userId },
      select: { id: true, current_code: true },
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    if (!project.current_code) {
      return res
        .status(400)
        .json({ message: "Wait for the website to finish generating" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { credits: true },
    });

    if (!user || user.credits < CREDITS_PER_GENERATION) {
      return res.status(403).json({
        message: "Not enough credits. Purchase more to keep editing.",
      });
    }

    await prisma.conversation.create({
      data: { role: "user", content: instruction, projectId: project.id },
    });

    const code = await reviseWebsite(project.current_code, instruction);

    const version = await prisma.version.create({
      data: { code, description: instruction.slice(0, 200), projectId: project.id },
    });

    await prisma.$transaction([
      prisma.websiteProject.update({
        where: { id: project.id },
        data: { current_code: code, current_version_index: version.id },
      }),
      prisma.conversation.create({
        data: {
          role: "assistant",
          content: "Done — the website has been updated.",
          projectId: project.id,
        },
      }),
      prisma.user.update({
        where: { id: req.userId },
        data: { credits: { decrement: CREDITS_PER_GENERATION } },
      }),
    ]);

    res.json({ message: "Website updated" });
  } catch (error) {
    console.error("POST /api/project/revision/:projectId", error);
    res.status(500).json({ message: "Could not apply the revision" });
  }
});

export default router;
