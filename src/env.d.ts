/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user?: import('./functions/getSession').SessionUser;
  }
}
