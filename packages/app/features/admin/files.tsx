import { YStack, XStack, Stack, Input, Theme, Paragraph, Text } from 'tamagui'
import { IconContainer, Center, getPendingResult, PendingAtomResult, Monaco, API, withSession, createApiAtom, usePendingEffect, PanelMenuItem, redirect, useHydratedAtom, DataCard, ItemCard, BigTitle, Search } from 'protolib'
import { PanelLayout } from '../../layout/PanelLayout'
import { Cross, Database, Key, Plus, PlusCircle, X, XCircle, XSquare } from '@tamagui/lucide-icons'
import { atom, useAtom } from 'jotai'
import { useUpdateEffect } from 'usehooks-ts'
import { useRouter } from 'next/router'
import { Dialog, H1, Link, ScrollView, Spinner } from '@my/ui'
import { useEffect, useState } from 'react'
import { useTint } from '@tamagui/logo'
import { ChonkyActions, FullFileBrowser } from 'chonky';
import dynamic from 'next/dynamic'
import { setChonkyDefaults } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import { useThemeSetting } from '@tamagui/next-theme'
import { FileWidget } from './components/FilesWidget'

setChonkyDefaults({ iconComponent: ChonkyIconFA });
ChonkyActions.ToggleHiddenFiles.option.defaultValue = false;
const [filesArr, filesAtom] = createApiAtom([])
const currentDbAtom = atom(0)

const Menu = () => {
    return (<YStack pt="$10">

        <Link
            href={"/admin/files/"}
            onPressApp={() => { }}
        >
            <PanelMenuItem
                selected={true}
                icon={<Database color="$color11" strokeWidth={1.5} />}
                text={'Files'}
            />
        </Link>

    </YStack>)
}


export default function Admin({ pageSession, filesState, FileBrowser, CurrentPath, CurrentFile}) {
    const {resolvedTheme} = useThemeSetting()
    const [dialogOpen, setDialogOpen] = useState(CurrentFile?true:false)
    const router = useRouter()
    const [files, setFiles] = useHydratedAtom(filesArr, filesState, filesAtom)
    const [currentPath, setCurrentPath] = useState(CurrentPath)
    const [currentFile, setCurrentFile] = useState(CurrentFile ? CurrentFile : '')

    const currentFileName = currentFile.split('/')[currentFile.split('/').length-1]
    useUpdateEffect(() => {
        console.log('current Path: ', currentPath)
        //API.get('/adminapi/v1/files/'+currentPath, setFiles)
        router.push('/admin/files' + (!currentPath.startsWith('/') ? '/' : '') + currentPath)
    }, [currentPath])

    useUpdateEffect(() => {
        console.log('router q: ', router.query.file)
        const r = router.asPath.split('?')[0].substring('/admin/files'.length)
        if(router.query.file) {
            const file = (r+'/'+router.query.file).replace(/\/+/g, '/')
            setCurrentFile(file)
        } else {
            setCurrentFile('')
            setDialogOpen(false)
            console.log('useEffect fired!', r);
            setCurrentPath(r)
        }

    }, [router.asPath]);


    useEffect(() => {
        if(currentFile) {
            setDialogOpen(true)
        } else {
            const newQuery = { ...router.query };
            delete newQuery.file;
            router.replace({
                pathname: router.pathname,
                query: newQuery
            }, undefined, { shallow: true });
        }
    }, [currentFile])

    const onOpen = (file) => {
        console.log('on open client: ', file)
        if (file.isDir) return setCurrentPath(file.path ?? file.id)
        router.push('/admin/files' + (!currentPath.startsWith('/') ? '/' : '') + currentPath + '?file='+file.name)
    }

    return (<PanelLayout menuContent={<Menu />}>
        <XStack f={1} px={"$4"} flexWrap='wrap'>
            <FileBrowser folderChain={[{ id: '/', name: "Files", isDir: true }].concat(
                ...currentPath.split('/').map((x, i, arr) => {
                    return {
                        name: x,
                        id: arr.slice(0, i + 1).join('/'),
                        isDir: true
                    };
                })
            )} onOpen={onOpen} files={files.data.map(f => {
                return {
                    ...f,
                    thumbnailUrl: (f.name.endsWith('.png') || f.name.endsWith('.jpg') || f.name.endsWith('.jpeg')) ? '/adminapi/v1/files/' + f.path : undefined
                }
            })} />
            <Dialog open={dialogOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay />
                    <Dialog.Content p={0} backgroundColor={resolvedTheme=='dark'?"#1e1e1e":'white'} height={'90%'} width={"90%"} >
                        <FileWidget 
                            icons={[
                                <IconContainer onPress={() => {setCurrentFile(''); setDialogOpen(false)}}>
                                    <X color="var(--color)" size={"$1"} />
                                </IconContainer>
                            ]}
                            currentFileName={currentFileName} 
                            backgroundColor={resolvedTheme=='dark'?"#1e1e1e":'white'} 
                            currentFile={currentFile} 
                        />
                 
                        <Dialog.Close />
                    </Dialog.Content>
                </Dialog.Portal>

                {/* optionally change to sheet when small screen */}
                <Dialog.Adapt when="sm">
                    <Dialog.Sheet>
                        <Dialog.Sheet.Frame>
                            <Dialog.Adapt.Contents />
                        </Dialog.Sheet.Frame>
                        <Dialog.Sheet.Overlay />
                    </Dialog.Sheet>
                </Dialog.Adapt>
            </Dialog>
        </XStack>
    </PanelLayout>)
}