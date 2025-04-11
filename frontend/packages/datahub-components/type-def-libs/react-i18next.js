// Copyright (c) 2025 NTT InfraNet
// @flow
declare module 'react-i18next' {
  declare type TFunction = (key?: ?string, data?: ?Object) => string

  declare type WithNamespaces = {|
    t: TFunction,
    i18nOptions?: any,
    i18n: any,
    defaultNS?: string,
    reportNS?: string,
    lng?: string,
    tReady: boolean,
    initialI18nStore?: {},
    initialLanguage?: string
  |}

  declare type Namespace = string | string[]
  declare interface NamespaceExtractor {
    (props: any & { namespace: Namespace }): Namespace;
  }
  declare function withNamespaces(
    namespace?: Namespace | NamespaceExtractor,
    options?: any
  ): any // Todo
}
