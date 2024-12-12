// utils/numberFormatter.js
export const formatNumberWithDot = (value) =>
    value?.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export const parseNumberWithoutDot = (value) =>
    value?.replace(/\./g, '');
export const propFormatterNumber = {
    formatter: formatNumberWithDot,
    parser: parseNumberWithoutDot
}  