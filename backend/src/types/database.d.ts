interface IPostgreSqlError extends Error {
  code: string; // SQLSTATE code
  detail?: string;
  hint?: string;
  position?: string;
  table?: string;
  column?: string;
  dataType?: string;
  constraint?: string;
}

interface IBase {
  created_at?: Date;
  updated_at?: Date;
}
