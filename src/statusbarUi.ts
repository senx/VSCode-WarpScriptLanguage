import { StatusBarItem, window, StatusBarAlignment, workspace } from 'vscode';

export class StatusbarUi {

    private static _statusBarItem: StatusBarItem;

    public static get statusbar() {
        if (!StatusbarUi._statusBarItem) {
            StatusbarUi._statusBarItem = window
                .createStatusBarItem(StatusBarAlignment.Right, 100);

            // Show status bar only if user wants :)
            if (workspace.getConfiguration('warpscript', null).get('showButton'))
                this.statusbar.show();
        }

        return StatusbarUi._statusBarItem;
    }

    static Init() {
        if (!window.activeTextEditor.document) {
            setTimeout(() => StatusbarUi.Init(), 100);
        } else {
            switch (window.activeTextEditor.document.languageId) {
                case 'flows':
                    StatusbarUi.statusbar.show();
                    StatusbarUi.ExecuteFlows();
                    break;
                case 'warpscript':
                    StatusbarUi.statusbar.show();
                    StatusbarUi.Execute();
                    break;
                default:
                    StatusbarUi.statusbar.hide();
                    break;
            }
        }
    }

    static Working(workingMsg: string = 'Working on it...') {
        StatusbarUi.statusbar.text = `$(sync~spin) ${workingMsg}`;
        StatusbarUi.statusbar.tooltip = 'click to abort all running WarpScripts';
        StatusbarUi.statusbar.command = 'extension.abortAllWS';
    }

    public static Execute() {
        StatusbarUi.statusbar.text = '$(triangle-right) Exec WS';
        StatusbarUi.statusbar.command = 'extension.execWS';
        StatusbarUi.statusbar.tooltip = 'Click execute your WarpScript';
    }

    public static ExecuteFlows() {
        StatusbarUi.statusbar.text = '$(triangle-right) Exec FLoWS';
        StatusbarUi.statusbar.command = 'extension.execFlows';
        StatusbarUi.statusbar.tooltip = 'Click execute your FLoWS';
    }


    public static dispose() {
        StatusbarUi.statusbar.dispose();
    }
}