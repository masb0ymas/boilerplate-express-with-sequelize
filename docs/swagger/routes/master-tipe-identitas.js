/**
 * @swagger
 *
 * /master-tipe-identitas:
 *   get:
 *     tags: ['Master Tipe Identitas']
 *     summary: Get All Master Tipe Identitas
 *     produces:
 *       - application/json
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/pageSize'
 *       - $ref: '#/components/parameters/filtered'
 *       - $ref: '#/components/parameters/sorted'
 *     responses:
 *       200:
 *          description: Get All Data From Master Tipe Identitas
 */

/**
 * @swagger
 *
 * /master-tipe-identitas/{id}:
 *   get:
 *     tags: ['Master Tipe Identitas']
 *     summary: Get All Master Tipe Identitas By Id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Get All One From Master Tipe Identitas
 */

/**
 * @swagger
 *
 * /master-tipe-identitas:
 *   post:
 *     tags: ['Master Tipe Identitas']
 *     summary: Create new Data to Master Tipe Identitas
 *     security:
 *       - jwt: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: nama
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *          description: Create new Data to Master Tipe Identitas
 */

/**
 * @swagger
 *
 * /master-tipe-identitas/{id}:
 *   put:
 *     tags: ['Master Tipe Identitas']
 *     summary: Update Data Master Tipe Identitas
 *     security:
 *       - jwt: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *       - name: nama
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *          description: Update Data Master Tipe Identitas
 */

/**
 * @swagger
 *
 * /master-tipe-identitas/{id}:
 *   delete:
 *     tags: ['Master Tipe Identitas']
 *     summary: Delete Data Master Tipe Identitas
 *     security:
 *       - jwt: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *          description: Delete Data Master Tipe Identitas
 */
