/** Trimmed text value of a form field; files and missing fields become "". */
export function formText(form: FormData, name: string): string {
    const value = form.get(name);
    return typeof value === "string" ? value.trim() : "";
}
