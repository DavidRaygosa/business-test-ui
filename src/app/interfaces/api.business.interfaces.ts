export interface IError {
    StatusCode?: number,
    Message?: string
}

export interface ILogin {
    userName?: string,
    password?: string
}

export interface IRegister {
    username?: string,
    password?: string,
    name?: string,
    lastname?: string,
    direction?: string
}

export interface IItem {
    id?: number,
    code?: string,
    description?: string,
    price?: number,
    imageBase64?: string,
    image?: string,
    stock?: number,
    quantity?: number
}

export interface IStore {
    id?: number,
    branch?: string,
    direction?: string
}

export interface IItemStore {
    id?: number,
    date?: Date,
    item?: IItem,
    store?: IStore
}

export interface IItemStoreHandle {
    itemId?: number,
    storeId?: number
}

export interface IShippingCart {
    itemId?: number,
    quantity?: number
}

export interface IClientItemHandle {
    itemId?: number,
    quantity?: number
}

export interface IClient {
    id?: number,
    name?: string,
    lastname?: string,
    direction?: string,
    permissions?: Array<string>,
    roleId?: number
}

export interface IOrder {
    id?: number,
    clientId?: number,
    itemId?: number,
    item?: IItem,
    client?: IClient,
    quantity?: number,
    date?: Date
}

export interface IRole {
    id?: number,
    name?: string,
    permissions?: Array<string>
}

export interface IPermission {
    id?: number,
    name: string
}