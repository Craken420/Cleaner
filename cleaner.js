const fs = require('fs')
const path = require('path')
const R = require('ramda')

const { DrkBx } = require('./DarkBoxx')

const cleaner = R.pipe(
    DrkBx.cls.ansis,
    DrkBx.cls.withNo,
    DrkBx.cls.sqlMultiLineComments,
    DrkBx.cls.sqlLineComments,
    DrkBx.cls.tab,
    DrkBx.cls.iniEndSpace,
    DrkBx.cls.multiSpaceToOne,
    DrkBx.cls.emptyLines,
    DrkBx.add.cmpEnterInHead
)

const editForClean = R.curry( (coding, file) => {
    fs.writeFileSync(
        'Data\\' + path.basename(file),
        cleaner(
            DrkBx.files.recode(coding)(file)
        ),
        coding
    )
    return {
        file: file,
        status: true
    }
})

/*** ¡¡¡ For save in the original file !!! ***/
// const editForClean = R.curry( (coding, file) => {
//     fs.writeFileSync(
//         file,
//         cleaner(
//             DrkBx.files.recode(coding)(file)
//         ),
//         coding
//     )
//     return {
//         file: file,
//         status: true
//     }
// })

const runFile = file => {
    if ( path.extname(file) == '.sql' ) { return editForClean( 'utf16le' )( file ) }
    else { return editForClean( 'latin1' )( file ) }
}

const runDir = R.pipe(
    DrkBx.dir.chekAndGetFiltFls,
    R.map(runFile)
)

const conctRootRunFiles = R.pipe( DrkBx.dir.conctDirIsFile, R.map(runFile) )

/* Usage */
// const dirRep = 'C:\\Users\\lapena\\Documents\\Luis Angel\\Sección Mavi\\Intelisis\\Intelisis5000\\Reportes MAVI\\'
// const dirOrig = 'C:\\Users\\lapena\\Documents\\Luis Angel\\Sección Mavi\\Intelisis\\Intelisis5000\\Codigo Original\\'

/* Folder and extentions of the files */
// console.log(
//     runDir(
//         ['.sql','.vis','.frm','.esp','.tbl','.rep','.dlg'],
//         'Testing\\'
//     )
// )

/* Array of indicate files */
// console.log(
//     conctRootRunFiles([
//         'dbo.ActClave.Table.sql',
//         'dbo.AnexoCta.Table.sql',
//         'dbo.AjusteAnual.StoredProcedure.sql',
//         'AlmacenesVenta.frm'

//     ], 'Testing\\')
// )

/* One file */
// console.log(runFile('Testing\\dbo.AjusteAnual.StoredProcedure.sql'))
// runFile('Testing\\dbo.AjusteAnual.StoredProcedure.sql')

module.exports.cleaner = {
    conctRootRunFiles: conctRootRunFiles,
    editForClean: editForClean,
    runDir: runDir,
    runFile: runFile
}