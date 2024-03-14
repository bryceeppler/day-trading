export const changeStyleProperty = (id: string, variable: string, value: string) => {
  document.getElementById(id)?.style.setProperty(variable, value);
};

export const copyToClipboard = async (data: string) => {
  await navigator.clipboard.writeText(data);
};

export const createPDFUrlFromByte = (pdfBytes: ArrayBuffer): string => {
  const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
  return URL.createObjectURL(pdfBlob);
};

export const openNewTab = (url?: string) => {
  window.open(url, '_blank');
};
