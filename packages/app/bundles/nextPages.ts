import notesPages from './notes/nextPages'
import workspacePages from './workspace/nextPages'
import databasePages from 'protolib/adminpanel/bundles/database/adminPages'
import devicePages from 'protolib/adminpanel/bundles/devices/adminPages'
import filesPages from 'protolib/adminpanel/bundles/files/adminPages'
import usersPages from 'protolib/adminpanel/bundles/users/adminPages'
//import eventsPages from 'protolib/adminpanel/bundles/events/adminPages'
//import automationPages from 'protolib/adminpanel/bundles/automation/adminPages'
export default {
  ...notesPages,
  ...databasePages,
  ...devicePages,
  ...filesPages,
  ...usersPages,
  ...workspacePages
  /*   ...eventsPages,
    ...automationPages */
}