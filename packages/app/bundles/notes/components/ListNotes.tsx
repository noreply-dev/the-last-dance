import { DefaultLayout } from '../../../layout/DefaultLayout'
import { XStack, YStack, Button } from 'tamagui'
import { AlertDialog, API, Page, BlockTitle, ContainerLarge, usePendingEffect } from 'protolib'
import { ObjectListView } from 'protolib/base/components'
import { NotePreview } from './NotePreview'
import { Plus } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { NoteAdd } from '../components/NoteAdd'

export const ListNotes = ({initialElements}) => {
    const [elements, setElements] = useState(initialElements)
    const [open, setOpen] = useState(false)
    usePendingEffect((s) => API.get('/api/v1/notes', s), setElements, initialElements)

    return <Page>

    <AlertDialog
      acceptCaption="Add"
      setOpen={setOpen}
      open={open}
      onAccept={async (setOpen) => {
        setOpen(false)
      }}
      title={'Add new note'}
      description={""}
    >
      <YStack f={1} jc="center" ai="center">
        <NoteAdd />
      </YStack>
    </AlertDialog>


    <DefaultLayout title="notes" footer={null}>
        <ContainerLarge contain="layout" pos="relative">
          <YStack mt="$5" p="$5">
            <XStack f={1} mb={"$5"} ml={"$5"} $sm={{ml:"$0"}} jc="center" ai="center">
              <XStack f={1}>
                <BlockTitle title="Notes"></BlockTitle>
              </XStack>
              <XStack>
                <Button $sm={{mr:"$0"}} mr="$2" onPress={() => setOpen(true)} chromeless={true}>
                  <Plus />
                </Button>
              </XStack>
            </XStack>
            <ObjectListView listItem={NotePreview} elements={elements} />
          </YStack>
        </ContainerLarge>
        {/* <YStack pe="none" zi={0} fullscreen className="bg-dot-grid mask-gradient-down" /> */}
    </DefaultLayout>
  </Page>
}