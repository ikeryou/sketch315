import { MyDisplay } from "../core/myDisplay";
import { Tween } from "../core/tween";
import { OutlineData } from "./outlineData";
import { Vector2 } from "three/src/math/Vector2";
import { Item } from "./item";
import { Param } from "../core/param";
import { Func } from "../core/func";
import { Util } from "../libs/util";
import { Conf } from "../core/conf";
import { HSL } from "../libs/hsl";

// -----------------------------------------
//
// -----------------------------------------
export class Contents extends MyDisplay {

  private _pointData:Array<Vector2> = [];
  private _item:Array<Item> = [];

  constructor(opt:any) {
    super(opt)

    Param.instance;

    // 背景色
    const col = Util.instance.randomArr(Conf.instance.COLOR).clone();
    const hsl = new HSL();
    col.getHSL(hsl);
    hsl.s *= 0.5;
    hsl.l *= 1.5;
    col.setHSL(hsl.h, hsl.s, hsl.l);
    Tween.instance.set(document.querySelector('body,html'), {
      backgroundColor:col.getStyle(),
    })

    const data = new OutlineData();
    data.load('./assets/data.svg', this._pointData, () => {
      this._pointData.forEach((val,i) => {
        // ちょっとまびく
        if(i % 1 == 0) {
          const itemEl = document.createElement('button');
          this.getEl().append(itemEl);

          const item = new Item({
            el:itemEl
          });
          this._item.push(item);

          Tween.instance.set(itemEl, {
            x:val.x,
            y:val.y,
          })

          // 真ん中までの距離でソート
          const dx = (Func.instance.sw() * 0.5) - val.x;
          const dy = (Func.instance.sh() * 0.5) - val.y;
          item.d = Math.sqrt(dx * dx + dy * dy);
        }
      })

      // 選択順の変更
      console.log(this._item.length)
      // Util.instance.sort(this._item, 'd', false);
      // this._item.reverse();
      this._item.forEach((val,i) => {
        val.getEl().setAttribute('tabindex', String(i));
      })
    })

    this._resize();
  }

  protected _update(): void {
    super._update();
  }

  protected _resize(): void {
    super._resize();
  }
}