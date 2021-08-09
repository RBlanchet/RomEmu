export default class TimestampFactory {
  public static now()
  {
    let date = new Date();
    let hh = date.getHours();
    let mm = date.getMinutes();
    let ss = date.getSeconds();

    let hhS: string = hh.toString();
    let mmS: string = mm.toString();
    let ssS: string = ss.toString();

    if (hh < 10) { hhS = "0" + hh; }
    if (mm < 10) { mmS = "0" + mm; }
    if (ss < 10) { ssS = "0" + ss; }

    return (hhS + ":" + mmS + ":" + ssS);
  }
}
