# Dokumentasi

boilerplate express with sequelize dirancang karna pengalaman pribadi maupun tim dalam inisiasi project maupun melanjutkan project, dari tiap project berbeda-beda struktur nya, sampai handle middleware yang tidak tepat.

- [Dokumentasi](#dokumentasi)
- [Instalasi](#instalasi)
  - [Struktur Folder](#struktur-folder)
- [Cara Mengggunakan Boilerplate](#cara-mengggunakan-boilerplate)
  - [Generate Model dari Sequelize CLI](#generate-model-dari-sequelize-cli)

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

untuk dokumentasi lebih lengkap bisa dilihat di [Sequelize CLI](https://sequelize.org/v5/manual/migrations.html)

setelah diatur migration dan model nya sesuai kebutuhan. sebagai contoh seperti ini

```javascript
# src/models/role.js

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
# src/migrations/20191214063429-create-role.js

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

lalu sebelum masuk ke folder `src/controllers/` atur dulu model validation nya di folder `src/models/validations/`

contoh penggunaan model validation:

```javascript
# src/models/validations/mvRole.js

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

const getCreateSchema = (language = 'id') => {
  return yup.object().shape(getShapeSchema(false, language))
}

const getUpdateSchema = (language = 'id') => {
  return yup.object().shape(getShapeSchema(true, language))
}

module.exports = {
  getCreateSchema,
  getUpdateSchema,
}
```

Alasan kenapa Skema Validasi di pisah antara `getCreateSchema` dan `getUpdateSchema`.

`getCreateSchema` digunakan untuk fungsi `create data` sedangkan `getUpdateSchema` digunakan untuk fungsi `update data` yang nantinya ngecek id sewaktu edit data.
