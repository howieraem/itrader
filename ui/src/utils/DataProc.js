import { getStockDetails } from "./DataAPI";

function procAssetProfile(assetProfile) {
  let address = [assetProfile.address1];
  if (assetProfile.address2)  address.push(assetProfile.address2);
  if (assetProfile.city)  address.push(assetProfile.city);
  if (assetProfile.state) {
    const state = assetProfile.state;
    if (assetProfile.zip) {
      address.push(state + ' ' + assetProfile.zip);
    } else {
      address.push(state);
    }
  }
  address.push(assetProfile.country);

  const website = assetProfile.website ? assetProfile.website.replace('http:', 'https:') : null;

  return {
    "Industry": assetProfile.industry,
    "Sector": assetProfile.sector,
    "Summary": assetProfile.longBusinessSummary,
    "Address": address.join(", "),
    "Chief Officer": assetProfile.companyOfficers[0].name,
    "Employees": assetProfile.fullTimeEmployees,
    "Website": website,
    "Phone": assetProfile.phone ? assetProfile.phone : "N/A",
    "Fax": assetProfile.fax ? assetProfile.fax : "N/A",
    "Overall Risk": assetProfile.overallRisk,
    "Audit Risk": assetProfile.auditRisk,
    "Board Risk": assetProfile.boardRisk,
    "Compensation Risk": assetProfile.compensationRisk,
    "Share Holder Rights Risk": assetProfile.shareHolderRightsRisk,
  };
}

export function getAssetProfile(symbol) {
  return new Promise((resolve, reject) => {
    const key = `${symbol}_assetProfile`;
    const cached = localStorage.getItem(key);
    if (cached) {
      let assetProfile = JSON.parse(cached);
      if (assetProfile["Website"]) {
        const website = assetProfile["Website"];
        assetProfile["Website"] = <a href={website}>{website}</a>
      } else {
        assetProfile["Website"] = "N/A";
      }
      return resolve(assetProfile);
    }
    return getStockDetails(symbol, "assetProfile").then(raw => {
      const assetProfile = procAssetProfile(raw);
      localStorage.setItem(key, JSON.stringify(assetProfile));
      if (assetProfile["Website"]) {
        const website = assetProfile["Website"];
        assetProfile["Website"] = <a href={website}>{website}</a>
      } else {
        assetProfile["Website"] = "N/A";
      }
      return resolve(assetProfile);
    }).catch(err => reject(err));
  });
}

function camelToSentence(camelCase) {
  const im = camelCase.replace(/([A-Z])/g, " $1");
  return im.charAt(0).toUpperCase() + im.slice(1);
}

const financialDataSpecialKeys = new Set([
  "financialCurrency", "ebitda", "ebitdaMargins", "maxAge", "currentPrice", "currentRatio", "numberOfAnalystOpinions"])

function procFinancialData(financialData) {
  let res = {
    "Financial Currency": financialData.financialCurrency,
    "EBITA": financialData.ebitda.fmt,
    "EBITA Margins": financialData.ebitdaMargins.fmt,
  };

  for (let key in financialData) {
    if (financialDataSpecialKeys.has(key))  continue;
    const newKey = camelToSentence(key);
    if (Object.keys(financialData[key]).length === 0) {
      res[newKey] = "(None)";
      continue;
    }
    if (financialData[key].fmt !== undefined) {
      res[newKey] = financialData[key].fmt;
    } else {
      res[newKey] = financialData[key].replace("none", "(None)");
    }
  }
  return res;
}

export function getFinancialData(symbol) {
  return new Promise((resolve, reject) => {
    const key = `${symbol}_financialData`;
    const cached = localStorage.getItem(key);
    if (cached)  return resolve(JSON.parse(cached));
    return getStockDetails(symbol, "financialData").then(raw => {
      const financialData = procFinancialData(raw);
      localStorage.setItem(key, JSON.stringify(financialData));
      return resolve(financialData);
    }).catch(err => reject(err));
  });
}

const otherStatsKeys = {
  beta: "Beta",
  enterpriseValue: "EV",
  enterpriseToEbitda: "EV/EBITDA",
  enterpriseToRevenue: "EV/R",
  heldPercentInstitutions: "Percentage held by Institutions",
  heldPercentInsiders: "Percentage held by Insiders",
  pegRatio: "PEG Ratio",
  floatShares: "Floating Shares",
  sharesShort: "Short Shares",
  shortRatio: "Short Ratio"
}

function procOtherStats(otherStats) {
  let res = {};
  for (let key in otherStatsKeys) {
    const newKey = otherStatsKeys[key];
    const val = otherStats[key];
    if (Object.keys(val).length === 0) {
      res[newKey] = "(None)";
      continue;
    }
    if (val.fmt !== undefined) {
      res[newKey] = val.fmt;
    } else {
      res[newKey] = val;
    }
  }
  return res;
}

export function getOtherStats(symbol) {
  return new Promise((resolve, reject) => {
    const key = `${symbol}_otherStats`;
    const cached = localStorage.getItem(key);
    if (cached)  return resolve(JSON.parse(cached));
    return getStockDetails(symbol, "defaultKeyStatistics")
      .then(raw => {
        const otherStats = procOtherStats(raw);
        localStorage.setItem(key, JSON.stringify(otherStats));
        resolve(otherStats);
      })
      .catch(e => reject(e));
  })
}
