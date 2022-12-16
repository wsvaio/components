import { DialogProps, FormProps, FormInstance, DrawerProps } from "element-plus";

export type Writeable<T> = {
  -readonly [K in keyof T]: T[K];
};
export type VDialogCtx = {
  dialog: Writeable<Partial<DialogProps>>;
  form: Writeable<Partial<FormProps>>;
  payload: Record<any, any> & {
    $show: boolean;
    $slot: string;
    $name: string;
  };
  loading: boolean;
  act: (
    options?: string | ({ $show?: boolean; $slot?: string; $name?: string } & Record<any, any>)
  ) => Promise<any>;
  elFormRef?: FormInstance;
  close: () => void;
};

export type VDrawerCtx = {
  drawer: Writeable<Partial<DrawerProps>>;
  form: Writeable<Partial<FormProps>>;
  payload: Record<any, any> & { $name: string; $show: boolean; $slot: string };
  loading: boolean;
  act: (
    options?: string | ({ $show?: boolean; $slot?: string; $name?: string } & Record<any, any>)
  ) => Promise<any>;
  elFormRef?: FormInstance;
  close: () => void;
};

export type VTableCtx = {
  params: Record<any, any>;
  checkList: Record<any, any>[];
  refresh: () => void;
} & VDrawerCtx;
