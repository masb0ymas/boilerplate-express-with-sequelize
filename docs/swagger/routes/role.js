/**
 * @swagger
 *
 * /role:
 *   get:
 *     tags: ['Role']
 *     summary: Get All Role
 *     produces:
 *       - application/json
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/pageSize'
 *       - $ref: '#/components/parameters/filtered'
 *       - $ref: '#/components/parameters/sorted'
 *     responses:
 *       200:
 *          description: Get All Data From Role
 */

/**
 * @swagger
 *
 * /role/{id}:
 *   get:
 *     tags: ['Role']
 *     summary: Get All Role By Id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Get All One From Role
 */

/**
 * @swagger
 *
 * /role:
 *   post:
 *     tags: ['Role']
 *     summary: Create new Data to Role
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
 *          description: Create new Data to Role
 */

/**
 * @swagger
 *
 * /role/{id}:
 *   put:
 *     tags: ['Role']
 *     summary: Update Data Role
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
 *          description: Update Data Role
 */

/**
 * @swagger
 *
 * /role/{id}:
 *   delete:
 *     tags: ['Role']
 *     summary: Delete Data Role
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
 *          description: Delete Data Role
 */
