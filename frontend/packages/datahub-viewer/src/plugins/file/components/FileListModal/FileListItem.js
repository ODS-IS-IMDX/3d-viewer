// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import styled from 'styled-components'
import { Box, Button, Flex } from '@ehv/datahub-components'
import { IconTrash } from '@ehv/datahub-icons'
import { MODAL_TYPE } from 'plugins/file/constants'
import { allOptions as projectionOptionList } from '../FileRegisterModal/sub-components/ProjectionSelect'
import { allOptions as verticalProjectionOptionList } from '../FileRegisterModal/sub-components/VerticalProjectionSelect'

import type { TFunction } from 'react-i18next'
import type { UploadFile, UploadFileInfo } from 'plugins/file/reducer'
import type { FileSelectFileAction } from 'plugins/file/actions'

type FileListItemProps = {
  file: UploadFile,
  index: number,
  isTooLongName: boolean,
  setDeleteConfirm: (isDeleteConfirm: boolean) => void,
  setDeleteIndex: (index: number) => void,
  selectFile: (index: number) => FileSelectFileAction,
  setModalType: (modalType: string) => void,
  t: TFunction
}

const FileNameBox = styled(Box)`
  line-height: 40px;
  width: 480px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
const WarningMessageBox = styled(FileNameBox)`
  line-height: 16px;
  font-size: 14px;
  color: red;
`

const InfoBox = styled(Box)`
  margin-bottom: 20px;
  padding: 10px;
  line-height: 23px;
  box-sizing: border-box;
  white-space: pre-wrap;
`
const DeleteIconWrapper = styled.div`
  height: 20px;
  width: 20px;
  margin: auto;
  cursor: pointer;

  &:hover {
    transform: scale(1.2);
  }
`
const getFileInfoString = (info: UploadFileInfo, t: TFunction) => {
  let fileInfoString = ''
  fileInfoString += t(`fileListModal.info.${info.category}`) + '\n'
  info.formatType && (fileInfoString += info.formatType + '\n')
  if (info.cesiumOptions) {
    if (info.cesiumOptions.srid) {
      // $FlowFixMe[infererror]
      const selectedOption = projectionOptionList.find(
        option => option.value === info.cesiumOptions.srid
      )
      // $FlowFixMe[infererror]
      const projectionInfo = selectedOption
        ? selectedOption.label
        : 'EPSG:' + info.cesiumOptions.srid
      fileInfoString +=
        t('fileListModal.info.projection') + projectionInfo + '\n'
    }
    if (info.cesiumOptions.verticalSrid) {
      // $FlowFixMe[infererror]
      const selectedOption = verticalProjectionOptionList.find(
        option => option.value === info.cesiumOptions.verticalSrid
      )
      // $FlowFixMe[infererror]
      const verticalProjectionInfo = selectedOption
        ? selectedOption.label
        : 'EPSG:' + info.cesiumOptions.verticalSrid
      fileInfoString +=
        t('fileListModal.info.verticalProjection') +
        verticalProjectionInfo +
        '\n'
    }
  }
  if (info.locationInfo) {
    const { isDecimalCoordinate, lat, lon } = info.locationInfo
    const locationInfoMayExistKeys = [
      'hsl',
      'ellipsoidHeight',
      'heading',
      'pitch',
      'roll'
    ]
    if (isDecimalCoordinate) {
      if (lat.decimal !== '') {
        fileInfoString +=
          t('fileListModal.info.locationInfo') +
          t('fileListModal.info.lat') +
          lat.decimal +
          ' ' +
          t('fileListModal.info.lon') +
          lon.decimal

        locationInfoMayExistKeys.forEach(key => {
          // $FlowIgnore[prop-missing]
          // $FlowIgnore[incompatible-use]
          const value = info.locationInfo[key]
          if (value !== undefined && value !== '') {
            fileInfoString += ' ' + t(`fileListModal.info.${key}`) + ' ' + value
          }
        })

        fileInfoString += '\n'
      }
    } else {
      if (lat.degree !== '') {
        fileInfoString +=
          t('fileListModal.info.locationInfo') +
          t('fileListModal.info.lat') +
          lat.degree +
          '°' +
          lat.minute +
          '′' +
          lat.second +
          '″ ' +
          t('fileListModal.info.lon') +
          lon.degree +
          '°' +
          lon.minute +
          '′' +
          lon.second +
          '″'

        locationInfoMayExistKeys.forEach(key => {
          // $FlowIgnore[prop-missing]
          // $FlowIgnore[incompatible-use]
          const value = info.locationInfo[key]
          if (value !== undefined && value !== '') {
            fileInfoString += ' ' + t(`fileListModal.info.${key}`) + value
          }
        })

        fileInfoString += '\n'
      }
    }
  }
  fileInfoString += `${info.isSpace ? '空間ID化する' : '空間ID化しない'}\n`
  // $FlowFixMe[infererror]
  info.startDateTime &&
    (fileInfoString +=
      t('fileListModal.info.startDateTime') +
      info.startDateTime.toLocaleDateString() +
      '\n')
  // $FlowFixMe[infererror]
  info.endDateTime &&
    (fileInfoString +=
      t('fileListModal.info.endDateTime') +
      info.endDateTime.toLocaleDateString() +
      '\n')

  return fileInfoString
}

const FileListItemComponent = (props: FileListItemProps) => {
  const {
    file,
    index,
    isTooLongName,
    setDeleteConfirm,
    setDeleteIndex,
    selectFile,
    setModalType,
    t
  } = props

  return (
    <>
      <Flex>
        <Box title={file.fullPath}>
          <FileNameBox>{file.name}</FileNameBox>
          <WarningMessageBox>
            {isTooLongName ? t('fileListModal.tooLongNameMessage') : ' '}
          </WarningMessageBox>
          <WarningMessageBox>
            {file.warning && file.warning.isOverSizeWldFile
              ? t('fileListModal.overSizeWldFileMessage')
              : ' '}
          </WarningMessageBox>
          <WarningMessageBox>
            {/* 動画ファイルの1GB制限メッセージ */}
            {file.warning && file.warning.isOverSizeVideoFile
              ? t('fileListModal.overSizeVideoFileMessage')
              : ' '}
          </WarningMessageBox>
        </Box>
        <Button
          type='button'
          width='125px'
          mx={1}
          mb={1}
          mt={2}
          ontSize={1}
          disabled={!file.isAllowed}
          onClick={() => {
            selectFile(index)
            setModalType(MODAL_TYPE.FILE_REGISTER)
          }}
        >
          {t('fileListModal.buttonLabel.input')}
        </Button>
        <DeleteIconWrapper>
          <IconTrash
            onClick={() => {
              setDeleteIndex(index)
              setDeleteConfirm(true)
            }}
          />
        </DeleteIconWrapper>
      </Flex>
      <InfoBox
        style={{
          backgroundColor: file.isAllowed
            ? file.info
              ? '#fff'
              : '#ffffe0'
            : '#ff3333',
          color: file.isAllowed ? '#606770' : '#fff'
        }}
      >
        {file.isAllowed
          ? file.info
            ? getFileInfoString(file.info, t)
            : t('fileListModal.info.isNotHaveInfo')
          : t('fileListModal.info.isNotAllowed')}
      </InfoBox>
    </>
  )
}

export const FileListItem = React.memo<FileListItemProps>(FileListItemComponent)
