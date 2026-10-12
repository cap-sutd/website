// Dynamic loader for the capstone collective.
// Each team member has a personalized folder in `src/content/members/<member-slug>/`.
// Adding a new folder automatically generates their dossier and includes them in the directory!

import collectiveConfig from "@/content/collective.json";

export const collective = collectiveConfig;

// Automatically discover all profile.json files across member folders
const profileModules = import.meta.glob("../content/members/*/profile.json", { eager: true });
// Added html/htm extensions so Vite bundles your portfolio HTML file
const assetModules = import.meta.glob("../content/members/*/*.{png,jpg,jpeg,webp,svg,pdf,html,htm}", {
  eager: true,
  import: "default",
  query: "?url",
});

function formatDocTitle(str) {
  if (!str) return "Document";
  const clean = str.split("/").pop().replace(/\.[^/.]+$/, "");
  return clean.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function resolvePortfolios(data, folderSlug, assetModules) {
  let rawList = [];

  if (Array.isArray(data.portfolios)) {
    rawList = data.portfolios;
  } else if (Array.isArray(data.portfolio)) {
    rawList = data.portfolio;
  } else if (data.portfolios && typeof data.portfolios === "object") {
    rawList = [data.portfolios];
  } else if (data.portfolio) {
    rawList = [data.portfolio];
  }

  const resolvedList = [];
  rawList.forEach((rawItem, index) => {
    let fileName = "";
    let explicitLink = "";
    let customTitle = null;
    let customCategory = null;
    let download = "";

    if (typeof rawItem === "string") {
      if (/^https?:\/\//i.test(rawItem)) {
        explicitLink = rawItem;
      } else {
        fileName = rawItem;
      }
    } else if (rawItem && typeof rawItem === "object") {
      fileName = rawItem.file || rawItem.src || rawItem.path || "";
      explicitLink = rawItem.link || rawItem.url || "";
      customTitle = rawItem.title;
      customCategory = rawItem.category;

      const dlFile = rawItem.download || data.download;
      if (dlFile) {
        const downloadKey = `../content/members/${folderSlug}/${dlFile}`;
        download = assetModules[downloadKey] || dlFile;
      }
    }

    if (!explicitLink && fileName && /^https?:\/\//i.test(fileName)) {
      explicitLink = fileName;
      fileName = "";
    }

    let fileUrl = null;
    if (fileName && !/^https?:\/\//i.test(fileName)) {
      const expectedKey = `../content/members/${folderSlug}/${fileName}`;
      fileUrl = assetModules[expectedKey] || null;
      if (!fileUrl) {
        const match = Object.entries(assetModules).find(
          ([p]) => p.replace(/\\/g, "/").toLowerCase() === expectedKey.toLowerCase()
        );
        if (match) fileUrl = match[1];
      }
    }

    if (!fileUrl && !explicitLink) return;

    const isPdf = Boolean(
      (fileUrl && /\.pdf($|\?)/i.test(fileUrl)) ||
      /\.pdf$/i.test(fileName)
    );

    const isHtml = Boolean(
      (fileUrl && /\.html?($|\?)/i.test(fileUrl)) ||
      /\.html?$/i.test(fileName)
    );

    const title = customTitle || formatDocTitle(fileName || explicitLink);
    const category = customCategory || (isHtml ? "HTML Document" : isPdf ? "PDF Document" : explicitLink ? "External Website" : "Visual Portfolio");

    resolvedList.push({
      id: `doc-${index + 1}`,
      title,
      fileName: fileName || explicitLink,
      file: fileUrl,
      link: explicitLink,
      isPdf,
      isHtml,
      category,
      download
    });
  });

  return resolvedList;
}

function loadTeamMembers() {
  const members = [];

  for (const [filePath, module] of Object.entries(profileModules)) {
    // Normalise path separators to forward slash
    const normalizedPath = filePath.replace(/\\/g, "/");
    // Extract folder name, e.g., "../content/members/kai-tanaka/profile.json" -> "kai-tanaka"
    const match = normalizedPath.match(/\/members\/([^/]+)\/profile\.json$/);
    if (!match) continue;
    const folderSlug = match[1];

    // Ignore template or hidden folders
    if (folderSlug.startsWith("_") || folderSlug.startsWith(".")) continue;

    const data = module.default || module;
    const memberId = data.id || folderSlug;

    // Resolve portrait image from member folder
    let portraitUrl = null;
    if (data.portrait) {
      const portraitKey = `../content/members/${folderSlug}/${data.portrait}`;
      portraitUrl = assetModules[portraitKey] || null;
    }
    if (!portraitUrl) {
      // Auto-fallback: look for any image containing portrait / avatar / photo in this member folder
      const folderImages = Object.entries(assetModules).filter(([p]) =>
        p.replace(/\\/g, "/").includes(`/members/${folderSlug}/`)
      );
      const portraitMatch = folderImages.find(([p]) =>
        /portrait|avatar|photo|headshot/i.test(p)
      );
      portraitUrl = portraitMatch ? portraitMatch[1] : folderImages[0]?.[1] || "";
    }

    // Resolve multiple portfolios / documents
    const portfolios = resolvePortfolios(data, folderSlug, assetModules);
    const primaryPortfolio = portfolios[0] || null;

    members.push({
      ...data,
      id: memberId,
      image: portraitUrl,
      portfolios,
      portfolioFile: primaryPortfolio?.file || null,
      portfolioImage: primaryPortfolio && !primaryPortfolio.isPdf && !primaryPortfolio.isHtml ? primaryPortfolio.file : null,
      isPortfolioPdf: primaryPortfolio?.isPdf || false,
      artifacts: data.artifacts || [],
      stack: data.stack || [],
    });
  }

  // Sort by index (01, 02, etc.) or id
  members.sort((a, b) => (a.index || "").localeCompare(b.index || ""));

  return members;
}

export const teamMembers = loadTeamMembers();

export const getMember = (id) => teamMembers.find((m) => m.id === id);