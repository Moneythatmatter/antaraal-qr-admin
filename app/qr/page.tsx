"use client";

import React from "react";
import { Download, QrCode as QrIcon, Printer, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

const FRONTEND_URL = "https://antaraal-qr-meue.vercel.app";

export default function QRPage() {
  const downloadQRCode = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new globalThis.Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "menu-qr.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="space-y-8">


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* QR Preview Card */}
        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-gray-50 flex flex-col items-center justify-center text-center group">
          <div className="p-8 bg-zinc-50 rounded-[2.5rem] shadow-inner mb-8 transform group-hover:scale-105 transition-transform duration-700">
            <QRCodeSVG
              id="qr-code-svg"
              value={FRONTEND_URL}
              size={280}
              level="H"
              includeMargin={true}
              imageSettings={{
                src: "/images/buddha.png",
                x: undefined,
                y: undefined,
                height: 50,
                width: 50,
                excavate: true,
              }}
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-serif font-semibold text-zinc-900 tracking-tight">Public Menu QR</h3>
            <p className="text-gray-400 text-sm font-medium tracking-wide">SCAN TO VIEW LIVE MENU</p>
          </div>

          <div className="w-full h-px bg-zinc-50 my-10" />

          <div className="grid grid-cols-2 gap-4 w-full text-zinc-900">
            <button
              onClick={downloadQRCode}
              className="flex items-center justify-center gap-3 bg-primary text-white p-5 rounded-3xl font-bold hover:bg-zinc-900 transition-all shadow-xl shadow-primary/20"
            >
              <Download size={20} /> PNG
            </button>
            <button className="flex items-center justify-center gap-3 bg-zinc-900 text-white p-5 rounded-3xl font-bold hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200">
              <Printer size={20} /> Print
            </button>
          </div>
        </div>

        {/* Info & Settings Card */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h4 className="text-xl font-bold text-zinc-900">QR Settings</h4>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between border border-gray-100">
                <div>
                  <p className="text-sm font-bold text-zinc-800">Custom Logo</p>
                  <p className="text-xs text-gray-400">Include restaurant logo in center</p>
                </div>
                <div className="w-12 h-6 bg-primary rounded-full relative px-1 flex items-center">
                  <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between border border-gray-100 opacity-50 cursor-not-allowed">
                <div>
                  <p className="text-sm font-bold text-zinc-800">Dynamic Links</p>
                  <p className="text-xs text-gray-400">Change URL without reprinting (PRO)</p>
                </div>
                <div className="w-12 h-6 bg-gray-200 rounded-full relative px-1 flex items-center">
                  <div className="w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 text-primary">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <Share2 size={24} className="text-primary" />
              </div>
              <h4 className="font-bold text-lg text-foreground">Instant Sharing</h4>
            </div>
            <p className="text-foreground/70 text-sm leading-relaxed mb-6">
              Download your high-resolution QR code and display it on table tents, windows, or coasters. Customers can scan it to instantly browse your menu without downloading any apps.
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(FRONTEND_URL);
                alert("Link copied!");
              }}
              className="w-full bg-white text-primary p-4 rounded-2xl font-bold hover:bg-primary/5 transition-all shadow-sm border border-primary/10"
            >
              Copy Menu Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
