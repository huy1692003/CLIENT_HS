import { useRecoilValue } from "recoil";
import { settingState } from "../recoil/atom";

export function getSetting(key) {
    const setting = useRecoilValue(settingState);
    var objKey = setting?.find(item => item.key === key);
    let valueType = objKey?.valueType;
    
    if (!objKey) return null;
    
    switch (valueType) {
        case "number":
            return Number(objKey.value);
        case "boolean":
            return objKey.value === "true" || objKey.value === true;
       
        case "date":
            return new Date(objKey.value);
        case "string":
        default:
            return objKey.value;
    }
}