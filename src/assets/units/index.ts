import thinkpad from "./thinkpad.png.asset.json";
import vivobook from "./vivobook.png.asset.json";
import redmibook from "./redmibook.png.asset.json";
import acer from "./acer.png.asset.json";
import macbook from "./macbook.png.asset.json";
import epsonPrinter from "./epson-printer.png.asset.json";
import hpPrinter from "./hp-printer.png.asset.json";
import viewsonic from "./viewsonic.png.asset.json";
import epsonProjE600 from "./epson-projector-e600.png.asset.json";
import epsonProjX600 from "./epson-projector-x600.png.asset.json";

// Map unit name -> product photo URL
export const unitImages: Record<string, string> = {
  "Advan Workplus": "https://metrokomputer.id/wp-content/uploads/2026/04/white-satu.png",
  "Lenovo ThinkPad": thinkpad.url,
  "ASUS VivoBook": vivobook.url,
  "RedmiBook 15": redmibook.url,
  "Acer Aspire 5": acer.url,
  "MacBook Air M1": macbook.url,
  "Epson L3210": epsonPrinter.url,
  "HP Smart Tank 215": hpPrinter.url,
  "ViewSonic SP3": viewsonic.url,
  "Epson EB-E600": epsonProjE600.url,
  "Epson EB-X600": epsonProjX600.url,
};

export const getUnitImage = (name: string): string | undefined => unitImages[name];
