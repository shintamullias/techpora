const WA = "6282177984041";

export const waLinkFor = (msg: string) =>
  `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
