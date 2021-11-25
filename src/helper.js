
export const serialize_helper = (v) => {
    return typeof v == "bigint"? `${v}n`: v
}

export const numberRanges = (t) => {
    switch(t) {
        case "uint8_t":
            return {min: 0, max: 255}
        case "uint16_t":
            return {min: 0, max: 65535}
        case "uint32_t":
            return {min: 0, max: 4294967295}
        case "uint64_t":
            return {min: 0, max: 18446744073709551615}
        case "int8_t":
            return {min: -128, max: 127}
        case "int16_t":
            return {min: -32768, max: 32767}
        case "int32_t":
            return {min: -2147483648, max: 2147483647}
        case "int64_t":
            return {min: -9223372036854775808, max: 9223372036854775807}
        default:
            return {min:0, max:0}
    }
}

