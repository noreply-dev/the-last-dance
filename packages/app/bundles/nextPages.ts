import notesPages from './notes/nextPages'
import workspacePages from './workspace/nextPages'
import databasePages from 'protolib/adminpanel/bundles/database/adminPages'
import devicePages from 'protolib/adminpanel/bundles/devices/adminPages'
import filesPages from 'protolib/adminpanel/bundles/files/adminPages'
import usersPages from 'protolib/adminpanel/bundles/users/adminPages'

export default {
  ...notesPages,
  ...workspacePages,
  ...databasePages,
  ...devicePages,
  ...filesPages,
  ...usersPages
}