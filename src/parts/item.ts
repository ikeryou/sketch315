import { MyDisplay } from "../core/myDisplay";
import { Tween } from "../core/tween";
import { Color } from "three/src/math/Color";
import { Point } from "../libs/point";
import { Util } from "../libs/util";
import { Val } from "../libs/val";
import { Conf } from "../core/conf";

// -----------------------------------------
//
// -----------------------------------------
export class Item extends MyDisplay {

  private _line:HTMLElement;
  private _fill:HTMLElement;
  private _noise:Point = new Point(Util.instance.random(0,1), Util.instance.random(0,1));
  private _isShow:number = 0;
  private _showRate:Val = new Val();

  // 真ん中までの距離
  public d:number = 0;

  constructor(opt:any) {
    super(opt)

    this._c = Util.instance.randomInt(0, 1000)

    this.addClass('s-gpu');

    this._line = document.createElement('div');
    this.getEl().append(this._line);

    this._fill = document.createElement('div');
    this.getEl().append(this._fill);

    // const colA = Util.instance.randomArr(Conf.instance.COLOR) as Color;
    const colB = Util.instance.randomArr(Conf.instance.COLOR) as Color;

    Tween.instance.set(this._line, {
      // border: ~~(Util.instance.mix(1, 3, this._noise.y)) + 'px solid ' + colA.getStyle(),
      backgroundColor: '#000000',
      scale:0,
      borderRadius: ~~(Util.instance.random(0, 50)) + '%'
    })

    Tween.instance.set(this._fill, {
      backgroundColor: colB.getStyle(),
      scale:0,
      borderRadius: ~~(Util.instance.random(0, 50)) + '%'
    })

    const size = Util.instance.mix(40, 120, this._noise.x) * 0.5
    Tween.instance.set(this.getEl(), {
      width:size,
      height:size,
    })

    this.getEl().addEventListener('focus', () => {
      this._show();
    })

    this._resize();
  }


  private _show(): void {
    if(this._isShow >= 1) return;

    this._isShow = 1;
    Tween.instance.a(this._showRate, {
      val:[0, 1]
    }, 0.4, 0.1, Tween.SpringA, null, null, () => {
      this._isShow = 2
    });
  }

  protected _update(): void {
    super._update();

    if(this._isShow >= 1) {
      // ゆらゆら
      const radian = Util.instance.radian(this._c * 2)
      const offset = 10;
      const offsetX = Math.sin(radian * 1.24) * offset * this._showRate.val
      const offsetY = Math.cos(radian * -0.87) * offset * this._showRate.val
      const rot = Math.sin(radian * 2.88) * 25 * this._showRate.val

      Tween.instance.set(this._fill, {
        x:offsetX,
        y:offsetY,
        scale:this._showRate.val,
        rotationZ:Util.instance.mix(-30, 30, this._noise.x) + (this._showRate.val * Util.instance.mix(-60, 60, this._noise.y)) + rot
      });

      Tween.instance.set(this._line, {
        x:offsetX,
        y:offsetY,
        scale:this._showRate.val * 1.25,
        rotationZ:Util.instance.mix(-30, 30, this._noise.y) + (this._showRate.val * Util.instance.mix(-60, 60, this._noise.x))
      });
    }
  }

  protected _resize(): void {
    super._resize();
  }
}