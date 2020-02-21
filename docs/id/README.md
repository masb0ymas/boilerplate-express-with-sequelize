# Dokumentasi

boilerplate express with sequelize dirancang karna pengalaman pribadi maupun tim dalam inisiasi project maupun melanjutkan project, dari tiap project berbeda-beda struktur nya, sampai handle middleware yang tidak tepat.

- [Dokumentasi](#dokumentasi)
- [Instalasi](#instalasi)
  - [Struktur Folder](#struktur-folder)
- [Cara Mengggunakan Boilerplate](#cara-mengggunakan-boilerplate)
  - [Generate Model dari Sequelize CLI](#generate-model-dari-sequelize-cli)
  - [Model Schema Validation](#model-schema-validation)
  - [Mengatur Controller](#mengatur-controller)
  - [Mengatur Route](#mengatur-route)

# Instalasi

1. Pertama clone terlebih dahulu :

```sh
# Clone Project

git clone https://github.com/masb0ymas/boilerplate-express-with-sequelize
```

2. Duplikasi `.env.example`. menjadi `.env`.
   
   Nah disini kamu harus atur dahulu koneksi ke databasenya dan pastikan kamu sudah ngintal database yg di perlukan, karna saya pake `Sequelize` kamu bisa lihat di dokumentasi nya database yang di support oleh [Sequelize](https://sequelize.org/v5/manual/getting-started.html)
   
3. Instal dependensi

```sh
# Install dependencies

yarn
```

kalo tidak terinstal yarn di local komputernya bisa pake `npm install`.

4. Setelah library di package.json nya sudah terinstal semua, bisa di jalankan dengan command

```bash
# running project

yarn start
```

5. kalo mau di jalankan di server, sebaiknya di build terlebih dahulu.

kenapa kodingannya di build, tidak disarankan kalo kodingan dalam proses development di jalankan di server ( VPS, Heroku atau sejenisnya).

```bash
# build project

yarn run build
```

ketika di jalankan yarn run build, babel nya akan ngecompile kodingan dari folder `src/` ke folder `dist/` dengan standar `ES5`

6. jalankan folder `dist/` mode `NODE_ENV=staging`

```bash
yarn run serve:staging
```

7. jalankan folder `dist/` mode `NODE_ENV=production`
   
```bash
yarn run serve:production
```

## Struktur Folder

Struktur folder ini saya lanjutkan dari generate **express** dan **sequelize**. Serta saya mengubah sedikit struktur folder di awal yang sekarang berada di folder `src`.
Tujuan saya menaruh semuanya folder `src` agar babel nya bisa nge build folder `src` menjadi outputnya `dist`. Nah folder `dist` yang akan di jalankan di server nantinya.

```bash
boilerplate-express-with-sequelize/
  node_modules/
  public/
    images/
    javascript/
    stylesheets/
  src/
    bin/
      server.js
    config/
      database.js
      email.js
      passport.js
    constants/
      ConstMasterTipeIdentitas.js
      ConstModel.js
      ConstRoles.js
      index.js
    controllers/
      base/
        SimpleMasterController.js
      AuthController.js
      MasterTipeIdentitasController.js
      RoleController.js
      UserController.js
    helpers/
      Common.js
      ExpressHelpers.js
      index.js
      Multer.js
      ObjectHelpers.js
      SequeliceMigration.js
      SequeliceSeed.js
      SequeliceHelpers.js
    middleware/
      index.js
      multerCSV.js
    migrations/
      20191214061950-create-user.js
      20191214063429-create-role.js
      20191218102531-create-master-tipe-identitas.js
    models/
      validations/
        mvBaseMaster.js
        mvRole.js
        mvUser.js
        xyup.js
      index.js
      master-tipe-identitas.js
      role.js
      user.js
    routes/
      admin.js
      index.js
      public.js
    seeders/
      20191214105446-seeder-role.js
      20191219055811-master-tipe-identitas.js
    utils/
      Directory.js
    app.js
  views/
    error.pug
    index.pug
    layout.pug
  .babelrc
  .editorconfig
  .env.example
  .eslintignore
  .eslintrc.json
  .gitignore
  .prettierrc.js
  .sequelizerc
  jsconfig.json
  LICENSE.md
  package.json
  README.md
  yarn.lock
```

Nah saya jelaskan sedikit fungsi-fungsi file tambahan yang powerful.
- .babelrc
  berfungsi agar file di folder `dist` bisa jalan runtime browser. Serta bisa menggunakan [Babel Resolver](https://github.com/tleunen/babel-plugin-module-resolver)
- .editorconfig
  biasanya digunakan untuk config Text Editor, seperti: `VS Code`, `IntelliJ IDEA`, `Sublime Text 3`, dll. 
- .eslintrc.json
  nah ini yang sangat membantu saya karna style javascript nya lebih rapi dan good code.
- .prettierrc.js
  berfungsi untuk merapikan kodingan, kalo di integrasikan dengan eslint selain dia merapihin kodingan juga ngebenerin variabel maupun fungsi (biasanya warning gitu).
- .sequelizerc ini buat nge route ulang `Sequelize CLI` nya ke folder yg udah di tentukan.

# Cara Mengggunakan Boilerplate

## Generate Model dari Sequelize CLI

Disini kamu hanya menjalankan command cli berikut untuk mengenerate model dan migration dari `Sequelize CLI`

```bash
npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string
```

penjelasan sedikit tentang `Sequelize CLI`
- ---name Nama_Tabel
- ---attributes field_Tabel:type_data

setelah diatur migration dan model nya sesuai kebutuhan. sebagai contoh seperti ini

```javascript
// src/models/role.js

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    'Role',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      nama: DataTypes.STRING,
    },
    {}
  )
  Role.associate = function(models) {
    // associations can be defined here
  }
  return Role
}

```

```javascript
// src/migrations/20191214063429-create-role.js

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Roles', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      nama: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Roles')
  },
}
```

setelah di atur migration nya lalu jalankan command cli

```bash
npx sequelize-cli db:migrate
```

untuk dokumentasi lebih lengkap bisa dilihat di [Sequelize CLI](https://sequelize.org/v5/manual/migrations.html)

## Model Schema Validation

lalu sebelum masuk ke folder `src/controllers/` atur dulu model validation nya di folder `src/models/validations/`

contoh penggunaan model validation:

```javascript
// src/models/validations/mvRole.js

const yup = require('yup')
const xyup = require('./xyup')

const dict = {
  id: {
    required: {
      nama: 'Nama wajib diisi',
    },
  },
}

const getShapeSchema = (required, language) => {
  // Default Langauge Id (Indonesia)
  const msg = Object.assign(dict.id, dict[language])
  return {
    id: xyup.uuid('Invalid Id', required),
    nama: yup.string().required(msg.required.nama),
  }
}

module.exports = xyup.generateFormSchema(getShapeSchema)
```

Pada `generateFormSchema` berisikan `getCreateSchema`, `getUpdateSchema` dan `getDefaultSchema`.

Alasan kenapa Skema Validasi di pisah antara `getCreateSchema` dan `getUpdateSchema`.

`getCreateSchema` digunakan untuk fungsi `create data` sedangkan `getUpdateSchema` digunakan untuk fungsi `update data` yang nantinya ngecek id sewaktu edit data.

setelah di atur `migration`, `models` dan `modelValidation` saatnya lanjut ke folder `Controller`

## Mengatur Controller

pada folder controller jika kamu mau bikin controller yang bersifat simpel atau sederhana, misalkan cuma CRUD, kamu tinggal nge wrapper controller kamu ke `SimpelMasterController`. 

Karna di `SimpleMasterController` sudah di atur semua, tinggal kirim parameter `models` dan `modelValidation`

contoh implementasi dari `SimpleMasterController` :

```javascript
// RoleController.js

import models from '../models'
import SimpleMasterController from './base/SimpleMasterController'
import mvRole from '../models/validations/mvRole'

const { Role } = models

module.exports = SimpleMasterController(Role, mvRole)

```

jika kamu ingin menambahkan `include Sequelize` atau custom function di controller kamu tanpa mengubah `SimpleMasterController`, yang kamu lakukan cuma nge replace function yg ada di `SimpleMasterController` atau sekedar ngatur options `configGetAll`, `configGetOne`, `configGetCreate`, ataupun `configGetUpdate`

contoh mengubah options config :

```javascript
// UserController.js

import models from '../models'
import SimpleMasterController from './base/SimpleMasterController'
import mvUser from '../models/validations/mvUser'

const { Role, User } = models

const including = [{ model: Role }]

module.exports = SimpleMasterController(User, mvUser, {
  configGetAll: {
    include: including,
  },
  configGetOne: {
    include: including,
  },
})

```

atau bisa juga seperti ini :

```javascript

import models from '../models'
import SimpleMasterController from './base/SimpleMasterController'
import mvUser from '../models/validations/mvUser'

const { Role, User } = models

const including = [{ model: Role }]

const baseController = SimpleMasterController(User, mvUser, {
  configGetAll: {
    include: including,
  },
  configGetOne: {
    include: including,
  },
})

async function create({ req, ResponseError }) {
  /*
    write here...
  */
}

module.exports = {
  ...baseController,
  create,
}

```

kalo kamu menulis kodingan seperti diatas, dia akan ngereplace function yang ada di `SimpleMasterController`

contoh penggunaan `Sequelice Query` :

```javascript
// Controller/UserController.js

const filterByRole = roleId => {
  return ({ value }) => {
    let curValue = value || undefined
    if (roleId) {
      curValue = {
        $ne: ROLE.ID_ADMIN, // $ne ( not equal )
      }
    }

    return curValue
  }
}

async function getAll({ req, ResponseError }) {
  const { roleId } = req.query
  const condition = await sQuery.generateWithPagination({
    req,
    model: Stok,
    configs: {
      include: including,
      optFilter: {
        defaultValues: {
          RoleId: '',
        },
        transformValueByKey: {
          RoleId: filterByApotek(roleId),
        },
      },
      optSort: {
        defaultValues: {
          createdAt: sQuery.Sort.DESC,
        },
      },
    },
  })
```

karna disini aku menggunakan `Sequelice Query` untuk ngehandle query `Sequelize ORM` nya, tujuannya gampang dipake dan struktur kodingan jadi lebih rapi.

Penjelasan lengkap tentang [Sequelice Query](https://github.com/chornos13/sequelice-query)

## Mengatur Route

Setelah kamu selesai membuat `model` dan `controller`, langkah selanjutnya kamu akan membuat `routing`, nah routing ini akan berguna nantinya saat kamu akses `endpoint route` nya, lalu endpoint route itu akan diarahkan ke `controller` yang kamu bikin.

Nah disini ada 2 routing di folder route yakni :
- admin.js
- public.js

`public.js` itu mengatur routing yang bisa di akses langsung dari luar, seperti `http://localhost:8000/v1/master-identitas` kalo di akses lewat browser langsung dia akan ngebaca method `GET`

sedangkan `admin.js` endpoint routing yang di protect oleh beberapa `middleware`, seperti `middleware auth`, `middleware multer`, dan middleware lainnya sesuai kebutuhan kamu.

cara bikin global middleware pada routing seperti berikut :

```javascript
/* Setup Router */
const router = express.Router()
const apiAdmin = new UnoRouter(router, {
  middleware: passport.authenticate('jwt', { session: false }),
  wrapperRequest,
})
```

contoh lengkap route admin.js

```javascript
// route/admin.js

import express from 'express'
import passport from 'passport'
import { Router as UnoRouter } from 'uno-api'
import { wrapperRequest } from '#helpers'
import multerCSV from '#middleware'

/* Setup Router */
const router = express.Router()
const apiAdmin = new UnoRouter(router, {
  middleware: passport.authenticate('jwt', { session: false }),
  wrapperRequest,
})
require('#config/passport')(passport)

const RoleController = require('#controllers/RoleController')

apiAdmin.create({
  baseURL: '/role',
  post: RoleController.create,
  putWithParam: [[':id', RoleController.update]],
  deleteWithParam: [[':id', RoleController.destroy]],
})
```

jika kamu tidak ingin menggunakan middleware di salah satu endpoint route nya, kamu hanya perlu `OverrideMiddleware` tersebut.

```javascript
import express from 'express'
import passport from 'passport'
import { Router as UnoRouter } from 'uno-api'

...

apiAdmin.create({
  baseURL: '/role',
  post: RoleController.create,
  putWithParam: [[':id', RoleController.update]],
  deleteWithParam: [[':id', RoleController.destroy]],
  overrideMiddleware // overrideMiddleware: true ( middleware akan non-aktif )
})
```

secara global / by default `overrideMiddleware: false`

Disini kamu hanya ngewrapping middleware ke dalam `UnoRouter`, jadi nantinya yang menggunakan `apiAdmin` udah terpasang middleware, penjelasan lebih lanjut tentang [Uno API](https://github.com/chornos13/uno-api)
