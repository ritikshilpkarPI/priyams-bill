import * as Yup from 'yup';
export const getYupValidationErrorMap = (error: any): YupValidationErrorMapType => {
  if (error instanceof Yup.ValidationError) {
    return error.inner.reduce((acc: any, err: Yup.ValidationError) => {
      if (err.path) {
        acc[err.path] = err.message;
      }
      return acc;
    }, {});
  }
  return {};
};
