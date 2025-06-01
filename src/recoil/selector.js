import { selector } from "recoil";
import { settingState } from "./atom";

export const settingFormat = selector({
    key: "settingFormat",
    get: ({get}) => {
        let setting = get(settingState);
        if (setting?.length === 0) return {};
        
        let formattedSettings = {};
        
        setting.forEach(item => {
            let valueType = item.valueType;
            let value = item.value;
            switch (valueType) {
                case "number":
                    value = Number(value);
                    break;
                case "boolean":
                    value = value === "true" || value === true;       
                    break;
                case "date":
                    value = new Date(value);
                    break;              
                default:
                    value = value;
            }
            formattedSettings[item.key] = { value };
        });
        
        return formattedSettings;
    }
})