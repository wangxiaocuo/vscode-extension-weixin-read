import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  let currentPanel: vscode.WebviewPanel | undefined = undefined;

  let disposable = vscode.commands.registerCommand('WeixinRead.start', () => {
    const columnToShowIn =
      vscode.window.activeTextEditor &&
      vscode.window.activeTextEditor.viewColumn
        ? vscode.window.activeTextEditor.viewColumn
        : vscode.ViewColumn.One;
    const configuration = vscode.workspace.getConfiguration('WeixinRead');
    const panelName: string = configuration.get('panelName') || '';

    if (currentPanel) {
      // 如果我们已经有一个面板，在目标列中显示它
      currentPanel.reveal(columnToShowIn);
    } else {
      currentPanel = vscode.window.createWebviewPanel(
        'WeixinRead',
        panelName,
        // 编辑器列中显示新的webview面板
        columnToShowIn,
        {
          // 启用JS，默认禁用
          enableScripts: true,
          // webview被隐藏时保持状态，避免被重置
          retainContextWhenHidden: true
        }
      );

      currentPanel.webview.html = getWebviewContent();

      // 当前面板关闭时重置
      currentPanel.onDidDispose(
        () => {
          currentPanel = undefined;
        },
        null,
        context.subscriptions
      );
    }
  });

  context.subscriptions.push(disposable);
}

function getWebviewContent() {
  return `<!DOCTYPE html>
		<html lang="zh-cmn-Hans">
			<head>
				<meta charset="UTF-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"
				/>
				<meta name="x5-orientation" content="portrait" />
				<meta name="x5-fullscreen" content="true" />
				<meta name="screen-orientation" content="portrait" />
				<meta name="full-screen" content="yes" />
				<meta name="renderer" content="webkit" />
				<meta http-equiv="X-UA-Compatible" content="ie=edge" />
				<title>微信读书</title>
				<style>
					html,
					body,
					iframe {
						width: 100%;
						height: 100%;
						border: 0;
						overflow: hidden;
					}
				</style>
			</head>
			<body>
				<iframe src="https://weread.qq.com/" />
			</body>
		</html>`;
}

// this method is called when your extension is deactivated
export function deactivate() {}
