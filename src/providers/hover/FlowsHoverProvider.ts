import { CancellationToken, Hover, Position, TextDocument } from 'vscode';
import { W10HoverProvider } from './W10HoverProvider';
import * as _ from 'lodash';
import * as flowsGlobals from '../../flowsGlobals';

export class FlowsHoverProvider extends W10HoverProvider {
  
  /**
   * 
   */
  getReference() {
    return flowsGlobals;
  }

	/**
	 * 
	 * @param {TextDocument} document 
	 * @param {Position} position 
	 * @param {CancellationToken} _token 
	 */
  public provideHover(document: TextDocument, position: Position, _token: CancellationToken): Hover | undefined | Promise<Hover> {
    return super.getHover(document, position, _token, 'flows',  /((->)?(((\w+[\w\d])+\.(\w+[\w\d])+)|(\w+[\w\d]+))(->)?)|(((\!=)|(\!)|(%)|(&&)|(&)|(\*\*)|(\*)|(\+\!)|(\+)|(>>>)|(>>)|(\-)|(\/)|(<<)|(<=)|(==)|(>=)|(>)|(<)|(\^)|(\|\|)|(\|)|(~=)|(~)))/); 
  }

  /**
   * Explicit warning : these function are imported from another js and are not typed.
   * 
   */
  generateSig(fn: any, macroname: string) {
    let sig = "";
    fn.sig.forEach((sigItem: any) => {
      if (sigItem[0] && sigItem[1]) {
        sig += macroname + '(' + this.populateInput(sigItem[0]) + '): '+ this.populateOutput(sigItem[1]) + '\n';
      } else {
        console.error('no sig for', fn);
      }
    });
    return sig;
  }

  private populateInput(sigItem: any) {
    let sigArea = "";
    sigItem.forEach((s: any, i: any) => {
      if (typeof s === "string" && s.indexOf("|") > 0) {
        var p = "(";
        s.split("|").forEach(function (i) {
          p += i.split(":")[0] + "|";
        });
        p = p.substring(0, p.length - 1) + ")";
        sigArea = this.prepend(sigArea, p + " (" + i.split(":")[1] + ") ");
      } else {
        if (_.isPlainObject(s)) {
          sigArea = this.prepend(sigArea, " }");
          _.forIn(s, (key: any) => {
            sigArea = this.prepend(
              sigArea,
              key.split(":")[0] + "<" + key.split(":")[1] + "> "
            );
          });
          sigArea = this.prepend(sigArea, "{ ");
        } else {
          if (_.isArray(s)) {
            sigArea = this.prepend(sigArea, "] ");
            s.forEach((value: any) => {
              sigArea = this.prepend(
                sigArea,
                value.split(":")[0] + "<" + value.split(":")[1] + "> "
              );
            });
            sigArea = this.prepend(sigArea, "[ ");
          } else {
            sigArea = this.prepend(
              sigArea,
              s.split(":")[0] + "<" + s.split(":")[1] + "> "
            );
          }
        }
      }
    });
    return sigArea;
  }


  private populateOutput(sigItem: any) {
    let sigArea = "";
    sigItem.reverse().forEach((s: any, i: any) => {
      if (typeof s === "string" && s.indexOf("|") > 0) {
        var p = "(";
        s.split("|").forEach(i => {
          p += i.split(":")[0] + "|";
        });
        p = p.substring(0, p.length - 1) + ")";
        sigArea += p + "<" + i.split(":")[1] + "> ";
      } else {
        if (_.isPlainObject(s)) {
          sigArea += " {";
          s.forEach((key: any, value: any) => {
            sigArea +=
              " " +
              key +
              "' " +
              value.split(":")[0] +
              "<" +
              value.split(":")[1] +
              "> \n\n";
          });
          sigArea += " }\n\n";
        } else {
          if (_.isArray(s)) {
            sigArea += " [ ";
            s.forEach((value: any) => {
              sigArea +=
                " " + value.split(":")[0] + "<" + value.split(":")[1] + "> ";
            });
            sigArea += " ]";
          } else {
            sigArea += " " + s.split(":")[0] + "<" + s.split(":")[1] + ">";
          }
        }
      }
    });
    return sigArea;
  }
}