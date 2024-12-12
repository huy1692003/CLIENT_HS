import { memo } from "react"

const LabelField = ({ children , label }) => {

    return (
        <div className="">
            <label className="font-medium text-gray-700 block mb-2">{label}</label> {/* Label cho Select */}
            {children}
        </div>
    )
}
export default memo(LabelField)