import { StatusBarItem, window, StatusBarAlignment, workspace } from 'vscode';

export class StatusbarUi {

    private static _statusBarItem: StatusBarItem;

    private static get statusbar() {
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
        StatusbarUi.Working('loading...');
        setTimeout(function () {
            StatusbarUi.Execute();
        }, 1000);
    }

    static Working(workingMsg: string = 'Working on it...') {
        StatusbarUi.statusbar.text = `$(sync~spin) ${workingMsg}`;
        StatusbarUi.statusbar.tooltip = '...';
        StatusbarUi.statusbar.command = null;
    }

    public static Execute() {
        StatusbarUi.statusbar.text = '$(triangle-right) Exec WS';
        StatusbarUi.statusbar.command = 'extension.execWS';
        StatusbarUi.statusbar.tooltip = 'Click execute your WarpScript';
    }


    public static dispose() {
        StatusbarUi.statusbar.dispose();
    }
}