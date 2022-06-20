import { format } from "d3-format";

export const INIT_CASH = 100000;
export const SERVER_URL = '';  // 'http://127.0.0.1:5000';
export const MARKET_LOC = {
  "us_market": "United States",
  "cn_market": "China (Mainland)",
  "hk_market": "Hong Kong",
  "gb_market": "UK",
  "sg_market": "Singapore",
  "tw_market": "Taiwan",
  "jp_market": "Japan",
  "kr_market": "South Korea",
  "ca_market": "Canada",
  "fr_market": "France",
  "de_market": "German",
  "dr_market": "German",
  "ru_market": "Russia",
  "au_market": "Australia",
  "ch_market": "Switzerland",
  "in_market": "India",
  "mx_market": "Mexico",
  "it_market": "Italy",
  "es_market": "Spain",
  "pt_market": "Portugal",
  "se_market": "Sweden",
  "sr_market": "Saudi Arabia",
  "ccc_market": "Global",
}

const nf = new Intl.NumberFormat('en-US');
const nf2 = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 });
const nf4 = new Intl.NumberFormat('en-US', { minimumFractionDigits: 4 });
const nfp = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const checkNone = num => {
  return num === undefined || num === null;
}

export const NF = num => {
  return checkNone(num) ? "N/A" : nf.format(num);
};

export const NF2 = num => {
  return checkNone(num) ? "N/A" : nf2.format(num);
};

export const NF4 = num => {
  return checkNone(num) ? "N/A" : nf4.format(num);
};

export const NFP = num => {
  return checkNone(num) ? "N/A" : nfp.format(num);
};

const numFormat = format(".4s");
export const NFV = num => {
  if (num === undefined || num === null)  return "N/A";
  return numFormat(num).replace(/G/, "B");   // Billion is a special case
}
