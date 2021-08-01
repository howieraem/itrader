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
    return getStockDetails(symbol, "assetProfile").then(result => {
      const assetProfile = procAssetProfile(result);
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
