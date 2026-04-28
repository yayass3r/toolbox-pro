import { NextRequest, NextResponse } from "next/server";

const APPWRITE_ENDPOINT = "https://cloud.appwrite.io/v1";
const APPWRITE_PROJECT_ID = "69f0d73900204f7b5dfc";
const APPWRITE_API_KEY = "14abf3937425ade8e78c9aa0a3e4f454b77d3bd4050ec3232b1f71f390730ec0e196220880e47c6503ec6c6892028cae047c44db1a8b6b1eba36af2d09c5307634a2ce3a33fc424673656b1379cd0abb7a485a7f1efde97da3e97235527a7e9a8e0b96ac84d1779dd341deae9fcb99cd6d3969ca2c0b2f229bd0bd9df61c2dc8";

const headers = {
  "Content-Type": "application/json",
  "X-Appwrite-Project": APPWRITE_PROJECT_ID,
  "X-Appwrite-Key": APPWRITE_API_KEY,
};

async function appwriteFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${APPWRITE_ENDPOINT}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string>) },
  });
  return res.json();
}

// Create database and collections
async function setupDatabase() {
  const results: string[] = [];

  // Create database
  const dbRes = await appwriteFetch("/databases", {
    method: "POST",
    body: JSON.stringify({
      databaseId: "toolbox_pro_db",
      name: "ToolBox Pro Database",
    }),
  });
  results.push(`Database: ${JSON.stringify(dbRes)}`);

  // Create collections
  const collections = [
    {
      collectionId: "users",
      name: "Users",
      attributes: [
        { key: "email", type: "string", size: 255, required: true },
        { key: "name", type: "string", size: 255, required: true },
        { key: "plan", type: "string", size: 50, required: true, default: "free" },
        { key: "avatar", type: "string", size: 500, required: false },
      ],
    },
    {
      collectionId: "newsletter",
      name: "Newsletter",
      attributes: [
        { key: "email", type: "string", size: 255, required: true },
        { key: "subscribed_at", type: "string", size: 100, required: true },
      ],
    },
    {
      collectionId: "subscriptions",
      name: "Subscriptions",
      attributes: [
        { key: "user_id", type: "string", size: 255, required: true },
        { key: "plan", type: "string", size: 50, required: true },
        { key: "status", type: "string", size: 50, required: true },
        { key: "stripe_session_id", type: "string", size: 255, required: false },
        { key: "expires_at", type: "string", size: 100, required: false },
      ],
    },
    {
      collectionId: "tool_usage",
      name: "Tool Usage",
      attributes: [
        { key: "user_id", type: "string", size: 255, required: false },
        { key: "tool_name", type: "string", size: 100, required: true },
        { key: "timestamp", type: "string", size: 100, required: true },
        { key: "ip", type: "string", size: 50, required: false },
      ],
    },
  ];

  for (const col of collections) {
    const colRes = await appwriteFetch(
      `/databases/toolbox_pro_db/collections`,
      {
        method: "POST",
        body: JSON.stringify({
          databaseId: "toolbox_pro_db",
          collectionId: col.collectionId,
          name: col.name,
          permissions: ['read("any")', 'create("any")', 'update("any")', 'delete("any")'],
        }),
      }
    );
    results.push(`Collection ${col.name}: ${JSON.stringify(colRes)}`);

    // Create attributes
    for (const attr of col.attributes) {
      const attrBody: Record<string, unknown> = {
        key: attr.key,
        required: attr.required,
      };

      let attrPath = "";
      if (attr.type === "string") {
        attrPath = `/databases/toolbox_pro_db/collections/${col.collectionId}/attributes/string`;
        attrBody.size = attr.size;
        if (attr.default) attrBody.default = attr.default;
      }

      if (attrPath) {
        const attrRes = await appwriteFetch(attrPath, {
          method: "POST",
          body: JSON.stringify(attrBody),
        });
        results.push(`  Attr ${attr.key}: ${JSON.stringify(attrRes)}`);
      }
    }
  }

  return results;
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    project: "ToolBox Pro",
    version: "1.0.0",
    appwrite: {
      projectId: APPWRITE_PROJECT_ID,
      endpoint: APPWRITE_ENDPOINT,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "setup-database") {
      const results = await setupDatabase();
      return NextResponse.json({ success: true, results });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
