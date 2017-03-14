export interface UserInterface {
  name? : string;
  email? : string;
  username? : string;
  password? : string;
  checked_email? : boolean;

  email_verification_token? : string;

  created_at? : Date;
  updated_at? : Date;
}
