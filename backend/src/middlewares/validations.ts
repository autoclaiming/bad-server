import { Joi, celebrate } from 'celebrate'
import { Types } from 'mongoose'

export const phoneRegExp = /^\+?\d{1,4}?[\s-]?\(?\d{1,4}\)?(?:[\s-]?\d{1,4}){1,4}$/

export enum PaymentType {
    Card = 'card',
    Online = 'online',
}

const STATUS_VALUES = ['cancelled', 'completed', 'new', 'delivering']
const ROLE_VALUES = ['customer', 'admin']

// валидация id
export const validateOrderBody = celebrate({
    body: Joi.object().keys({
        items: Joi.array()
            .items(
                Joi.string().custom((value, helpers) => {
                    if (Types.ObjectId.isValid(value)) {
                        return value
                    }
                    return helpers.message({ custom: 'Невалидный id' })
                })
            )
            .min(1)
            .max(100)
            .required()
            .messages({
                'array.empty': 'Не указаны товары',
                'array.max': 'Слишком много товаров в заказе',
            }),
        payment: Joi.string()
            .valid(...Object.values(PaymentType))
            .required()
            .messages({
                'string.valid':
                    'Указано не валидное значение для способа оплаты, возможные значения - "card", "online"',
                'string.empty': 'Не указан способ оплаты',
            }),
        email: Joi.string().email().max(254).required().messages({
            'string.empty': 'Не указан email',
        }),
        phone: Joi.string()
            .min(5)
            .max(20)
            .required()
            .pattern(phoneRegExp)
            .messages({
                'string.empty': 'Не указан телефон',
                'string.pattern.base': 'Не валидный номер телефона',
            }),
        address: Joi.string().min(1).max(500).required().messages({
            'string.empty': 'Не указан адрес',
        }),
        total: Joi.number().min(0).max(1000000000).required().messages({
            'string.empty': 'Не указана сумма заказа',
        }),
        comment: Joi.string().max(1000).optional().allow(''),
    }),
})

// валидация товара.
// name и link - обязательные поля, name - от 2 до 30 символов, link - валидный url
export const validateProductBody = celebrate({
    body: Joi.object().keys({
        title: Joi.string().required().min(2).max(30).messages({
            'string.min': 'Минимальная длина поля "name" - 2',
            'string.max': 'Максимальная длина поля "name" - 30',
            'string.empty': 'Поле "title" должно быть заполнено',
        }),
        image: Joi.object().keys({
            fileName: Joi.string().max(255).required(),
            originalName: Joi.string().max(255).required(),
        }),
        category: Joi.string().max(50).required().messages({
            'string.empty': 'Поле "category" должно быть заполнено',
        }),
        description: Joi.string().max(5000).required().messages({
            'string.empty': 'Поле "description" должно быть заполнено',
        }),
        price: Joi.number().min(0).max(1000000000).allow(null),
    }),
})

export const validateProductUpdateBody = celebrate({
    body: Joi.object().keys({
        title: Joi.string().min(2).max(30).messages({
            'string.min': 'Минимальная длина поля "name" - 2',
            'string.max': 'Максимальная длина поля "name" - 30',
        }),
        image: Joi.object().keys({
            fileName: Joi.string().max(255).required(),
            originalName: Joi.string().max(255).required(),
        }),
        category: Joi.string().max(50),
        description: Joi.string().max(5000),
        price: Joi.number().min(0).max(1000000000).allow(null),
    }),
})

export const validateObjId = celebrate({
    params: Joi.object().keys({
        productId: Joi.string()
            .required()
            .custom((value, helpers) => {
                if (Types.ObjectId.isValid(value)) {
                    return value
                }
                return helpers.message({ any: 'Невалидный id' })
            }),
    }),
})

export const validateUserBody = celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(30).messages({
            'string.min': 'Минимальная длина поля "name" - 2',
            'string.max': 'Максимальная длина поля "name" - 30',
        }),
        password: Joi.string().min(6).max(100).required().messages({
            'string.empty': 'Поле "password" должно быть заполнено',
        }),
        email: Joi.string()
            .required()
            .max(254)
            .email()
            .message('Поле "email" должно быть валидным email-адресом')
            .messages({
                'string.empty': 'Поле "email" должно быть заполнено',
            }),
    }),
})

export const validateAuthentication = celebrate({
    body: Joi.object().keys({
        email: Joi.string()
            .required()
            .max(254)
            .email()
            .message('Поле "email" должно быть валидным email-адресом')
            .messages({
                'string.required': 'Поле "email" должно быть заполнено',
            }),
        password: Joi.string().max(100).required().messages({
            'string.empty': 'Поле "password" должно быть заполнено',
        }),
    }),
})

const ORDER_SORT_FIELDS = [
    'createdAt',
    'totalAmount',
    'orderNumber',
    'status',
]

const CUSTOMER_SORT_FIELDS = [
    'createdAt',
    'totalAmount',
    'orderCount',
    'lastOrderDate',
    'name',
]

export const validateOrdersQuery = celebrate({
    query: Joi.object()
        .keys({
            page: Joi.number().integer().min(1).max(10000).default(1),
            limit: Joi.number().integer().min(1).default(10).failover(10).custom((v) => (v > 10 ? 10 : v)),
            sortField: Joi.string()
                .valid(...ORDER_SORT_FIELDS)
                .default('createdAt'),
            sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
            status: Joi.string().valid(...STATUS_VALUES),
            totalAmountFrom: Joi.number().min(0).max(1000000000),
            totalAmountTo: Joi.number().min(0).max(1000000000),
            orderDateFrom: Joi.date().iso(),
            orderDateTo: Joi.date().iso(),
            search: Joi.string().max(100).allow(''),
        })
        .unknown(false),
})

export const validateCurrentUserOrdersQuery = celebrate({
    query: Joi.object()
        .keys({
            page: Joi.number().integer().min(1).max(10000).default(1),
            limit: Joi.number().integer().min(1).default(10).failover(10).custom((v) => (v > 10 ? 10 : v)),
            search: Joi.string().max(100).allow(''),
        })
        .unknown(false),
})

export const validateCustomersQuery = celebrate({
    query: Joi.object()
        .keys({
            page: Joi.number().integer().min(1).max(10000).default(1),
            limit: Joi.number().integer().min(1).default(10).failover(10).custom((v) => (v > 10 ? 10 : v)),
            sortField: Joi.string()
                .valid(...CUSTOMER_SORT_FIELDS)
                .default('createdAt'),
            sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
            registrationDateFrom: Joi.date().iso(),
            registrationDateTo: Joi.date().iso(),
            lastOrderDateFrom: Joi.date().iso(),
            lastOrderDateTo: Joi.date().iso(),
            totalAmountFrom: Joi.number().min(0).max(1000000000),
            totalAmountTo: Joi.number().min(0).max(1000000000),
            orderCountFrom: Joi.number().integer().min(0).max(100000),
            orderCountTo: Joi.number().integer().min(0).max(100000),
            search: Joi.string().max(100).allow(''),
        })
        .unknown(false),
})

export const validateProductsQuery = celebrate({
    query: Joi.object()
        .keys({
            page: Joi.number().integer().min(1).max(10000).default(1),
            limit: Joi.number().integer().min(1).default(10).failover(10).custom((v) => (v > 10 ? 10 : v)),
        })
        .unknown(false),
})

export const validateOrderNumber = celebrate({
    params: Joi.object().keys({
        orderNumber: Joi.number().integer().min(1).required(),
    }),
})

export const validateOrderStatusBody = celebrate({
    body: Joi.object().keys({
        status: Joi.string()
            .valid(...STATUS_VALUES)
            .required(),
    }),
})

export const validateObjIdParam = celebrate({
    params: Joi.object().keys({
        id: Joi.string()
            .required()
            .custom((value, helpers) => {
                if (Types.ObjectId.isValid(value)) {
                    return value
                }
                return helpers.message({ any: 'Невалидный id' })
            }),
    }),
})

export const validateUserId = celebrate({
    params: Joi.object().keys({
        id: Joi.string()
            .required()
            .custom((value, helpers) => {
                if (Types.ObjectId.isValid(value)) {
                    return value
                }
                return helpers.message({ any: 'Невалидный id' })
            }),
    }),
})

export const validateUpdateCurrentUser = celebrate({
    body: Joi.object()
        .keys({
            name: Joi.string().min(2).max(30),
            email: Joi.string().max(254).email(),
            phone: Joi.string().min(5).max(20).pattern(phoneRegExp),
        })
        .min(1),
})

export const validateUpdateCustomer = celebrate({
    body: Joi.object()
        .keys({
            name: Joi.string().min(2).max(30),
            email: Joi.string().max(254).email(),
            phone: Joi.string().min(5).max(20).pattern(phoneRegExp),
            roles: Joi.array().items(Joi.string().valid(...ROLE_VALUES)),
        })
        .min(1),
})
