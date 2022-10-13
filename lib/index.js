"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  activate: () => activate
});
module.exports = __toCommonJS(src_exports);
var import_coc = require("coc.nvim");
async function activate(context) {
  const config = import_coc.workspace.getConfiguration().get("sourcekit", {});
  if (config.enable === false) {
    return;
  }
  let commandPath = config.commandPath;
  if (!commandPath) {
    try {
      commandPath = (await import_coc.workspace.runCommand("which sourcekit-lsp")).trim();
    } catch {
      import_coc.window.showErrorMessage("Cannot find sourcekit-lsp. Install Xcode, swift, or set `sourcekit.commandPath` in your coc-config.");
      return;
    }
  }
  let args = [];
  const sdkPath = config.sdkPath;
  const sdk = config.sdk;
  if (sdkPath) {
    args = args.concat(["-Xswiftc", "-sdk", "-Xswiftc", sdkPath]);
  } else if (sdk) {
    try {
      const computedSdkPath = (await import_coc.workspace.runCommand(`xcrun --sdk ${sdk} --show-sdk-path`)).trim();
      args = args.concat(["-Xswiftc", "-sdk", "-Xswiftc", computedSdkPath]);
    } catch {
      import_coc.window.showErrorMessage(`Cannot find SDK path for '${sdk}'. Change 'sourcekit.sdk' or set 'sourcekit.sdkPath' in your coc-config.`);
    }
  }
  const targetArch = config.targetArch;
  if (targetArch) {
    args = args.concat(["-Xswiftc", "-target", "-Xswiftc", targetArch]);
  }
  args = args.concat(config.args);
  const serverOptions = {
    command: commandPath,
    args,
    options: { env: config.env },
    transport: import_coc.TransportKind.stdio
  };
  const clientOptions = {
    documentSelector: ["swift", "c", "cpp", "objective-c", "objective-cpp"]
  };
  const client = new import_coc.LanguageClient("sourcekit", "sourcekit", serverOptions, clientOptions);
  context.subscriptions.push(
    import_coc.services.registLanguageClient(client)
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate
});
