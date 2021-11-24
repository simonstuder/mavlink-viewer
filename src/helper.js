
export const serialize_helper = (v) => {
    return typeof v == "bigint"? `${v}n`: v
}

