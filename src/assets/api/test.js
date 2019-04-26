let url = '/proxy'

let test = {
    'isLogin' : url + '/api/isLogin',
    'leaveList' : url + '/api/approval/leave/list',
    'grade' : url + '/api/teacher/grade',
    'class' : url + '/api/grade/class',
    'leave' : url + '/api/approval/leave',
    'place' : url + '/api/place/all',
    'reserve' : url + '/api/place/reserve',
    'repair' : url + '/api/apply/repair',
    'repairs' : url + '/api/repair',
    'file' : url + '/api/upload/file',
    'photo' : url + '/api/apply/photo/',
    'apply' : url + '/api/apply',
    'mine' : url + '/api/apply/mine',
    'teacher' : url + '/api/department/teacher', // 教师
    'departmen' : url + '/api/school/department',
    'check' : url + '/api/apply/check',
    'score' : url + '/api/score',
    'import' : url + '/api/score/import',
    'course' : url + '/api/grade/course',
    'logout' : url + '/api/logout',
}

export default test