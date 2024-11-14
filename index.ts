import { BriefcaseManager, BriefcaseDb, IModelHost } from "@itwin/core-backend";
import { BackendIModelsAccess } from "@itwin/imodels-access-backend";
import { IModelsClient } from "@itwin/imodels-client-authoring";
import { NodeCliAuthorizationClient } from "@itwin/node-cli-authorization";
import { input } from "@inquirer/prompts";

async function main() {
    const authorizationClient = new NodeCliAuthorizationClient({
        clientId: "native-NGXzDFEzq47LFbLQgXMQhAnuA",
        redirectUri: "http://localhost:3000/signin-callback",
        scope: "itwin-platform",
    });

    console.log("Checking for credentials... ")

    await authorizationClient.signIn();

    console.log("Signed in!")

    const iTwinId = await input({ message: "Enter iTwinId (or ProjectId):" })
    const iModelId = await input({ message: "Enter iModelId:" })

    console.log("Thanks... setting up the app... ")

    const client = new IModelsClient({ api: { baseUrl: `https://api.bentley.com/imodels` } });
    await IModelHost.startup({ hubAccess: new BackendIModelsAccess(client), authorizationClient });

    console.log("Setup complete!")

    try {
        console.log("Downloading briefcase...")

        const token = await authorizationClient.getAccessToken();
        const briefcase = await BriefcaseManager.downloadBriefcase({
            iTwinId,
            accessToken: token,
            iModelId,
        });

        console.log("Briefcase downloaded!")
        console.log("Opening briefcase...")

        const db = await BriefcaseDb.open({
            fileName: briefcase.fileName,
            readonly: true,
        });

        console.log("Briefcase JSON summary: ")
        console.log(db.toJSON());
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await IModelHost.shutdown();
    }
}

main().catch(console.error);