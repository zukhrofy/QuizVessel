import * as yup from "yup";

export default yup.setLocale({
  mixed: {
    required: ({ path, label }) => `${label ? label : path} tidak boleh kosong`,
  },
  string: {
    min: ({ path, min }) => `${path} harus berisi minimal ${min}`,
    max: ({ path, max }) => `${path} melebihi batas ${max} karakter`,
  },
});
