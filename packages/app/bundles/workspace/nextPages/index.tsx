import { Workspace, getServerSideProps as getServerSidePropsWorkspace } from "./workspace"

export default {
  'workspace/*': { component: Workspace, getServerSideProps: getServerSidePropsWorkspace },
  /*'notes/*': { component: ViewNotePage, getServerSideProps: getServerSidePropsNotesView }*/
} as any