# Node CLI Briefcase Test

A quick script which tests downloading an iModel briefcase using the iModelHub API through Node.js.

Prerequisites:

- Node.js
- Bentley IMS account
- iTwinId
- iModelId

To run:

```shell
npm install
npm start
```

The script will open your default system web browser to authenticate with your Bentley IMS account. After authenticating, you'll be prompted to enter your iTwinId and iModelId. The script will then download the briefcase and output a JSON summary of the iModel.

If the script fails to download the briefcase due to an invalid cert or SSL error, you may need to set the `NODE_TLS_REJECT_UNAUTHORIZED` environment variable to `0`:

```shell
NODE_TLS_REJECT_UNAUTHORIZED=0 npm start
```

If this then succeeds, the underlying issue may be due to a self-signed certificate and/or corporate proxy.
