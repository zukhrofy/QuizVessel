import { ErrorMessage } from "@hookform/error-message";
import classNames from "classnames";

const FormInputField = ({ register, id, children, type, name, errors }) => {
  return (
    <div>
      <label
        className="mb-1 block text-sm font-medium text-gray-600"
        htmlFor={id}
      >
        {children}
      </label>
      <input
        id={id}
        type={type}
        className={classNames(
          `w-full rounded-lg border px-4 py-2 text-gray-700 focus:outline-none focus:ring-opacity-40`,
          {
            "border-red-500 focus:border-red-500 focus:ring-0": errors?.[name],
            "focus:border-blue-400 focus:ring focus:ring-blue-300":
              !errors?.[name],
          },
        )}
        {...register(name)}
      />
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => (
          <span className="text-xs text-red-500">{message}</span>
        )}
      />
    </div>
  );
};

export default FormInputField;
