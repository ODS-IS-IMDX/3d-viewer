// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Modal, Text } from '@ehv/datahub-components'
import { getExtension, getFileInfoListInZip } from 'utils/files'
import {
  EXTENSION,
  FILE_TYPE_TO_CATEGORY_MAP,
  FORMAT_TYPE_MAP,
  MODAL_TYPE,
  UNKNOWN_ZIP
} from 'plugins/file/constants'
import { ModalHeader, ModalFooter } from '../common-components'
import { ExtensionSelect } from './sub-components/ExtensionSelect'
import { CategorySelect } from './sub-components/CategorySelect'
import { FormatTypeSelect } from './sub-components/FormatTypeSelect'
import { ProjectionSelect } from './sub-components/ProjectionSelect'
import { VerticalProjectionSelect } from './sub-components/VerticalProjectionSelect'
import { TimePeriodSelect } from './sub-components/TimePeriodSelect'
import { IsSpaceSelect } from './sub-components/AddTerrainSelect'

import type { TFunction } from 'react-i18next'
import type { UploadFile, UploadFileInfo } from 'plugins/file/reducer'
import type { FileSetFilesInfoAction } from 'plugins/file/actions'

type FileRegisterModalProps = {|
  fileList: Array<UploadFile>,
  index: number,
  isMultiInput?: boolean,
  setFilesInfo: ({
    indexList: Array<number>,
    info: UploadFileInfo
  }) => FileSetFilesInfoAction,
  setModalType: (modalType: string) => void,
  t: TFunction
|}

const FileNameArea = styled(Text)`
  font-size: 20px;
  margin-bottom: 20px;
  font-weight: 600;
`

const FileRegisterModalComponent = (props: FileRegisterModalProps) => {
  const { fileList, index, isMultiInput, setFilesInfo, setModalType, t } = props

  const fileName = isMultiInput ? null : fileList[index].name
  const [fileType, setFileType] = useState(
    fileName ? getExtension(fileName) : ''
  )
  const displayCategoryList = FILE_TYPE_TO_CATEGORY_MAP.get(fileType) || []
  const [category, setCategory] = useState(
    displayCategoryList.length === 1 ? displayCategoryList[0] : ''
  )
  const displayFormatTypeList = FORMAT_TYPE_MAP.get(category)
    ? FORMAT_TYPE_MAP.get(category).get(fileType) || []
    : []
  const [formatType, setFormatType] = useState(
    displayFormatTypeList.length === 1 ? displayFormatTypeList[0] : ''
  )
  const [projection, setProjection] = useState(null)
  const [verticalProjection, setVerticalProjection] = useState(null)
  const [isTerrain, setIsTerrain] = useState(null)
  const [isSpace, setIsSpace] = useState(false)
  const [startDateTime, setStartDateTime] = useState(null)
  const [endDateTime, setEndDateTime] = useState(null)

  if (!isMultiInput && fileType === EXTENSION.ZIP && fileList[index].size > 0) {
    getFileInfoListInZip(fileList[index].file).then(fileInfoListInZip => {
      const { fileNameListInZip } = fileInfoListInZip
      const fileExtensionListInZip = Array.from(
        new Set(
          fileNameListInZip.map(filePathInZip => getExtension(filePathInZip))
        )
      )

      const knownExtensionInZipList = [EXTENSION.LAS, EXTENSION.LAZ]
      const zipFileType =
        knownExtensionInZipList.find(knownExtensionInZip =>
          fileExtensionListInZip.includes(knownExtensionInZip)
        ) || UNKNOWN_ZIP
      setFileType(zipFileType)
    })
  } else {
    fileType === EXTENSION.ZIP && !isMultiInput && setFileType(UNKNOWN_ZIP)
  }

  const isCategoryAvailable = !!fileType
  const isFormatTypeAvailable = !!category
  const isDtm = fileType === EXTENSION.LAS
  const [isProjectionAvailable, setProjectionAvailable] = useState(false)
  const [
    isVerticalProjectionAvailable,
    setVerticalProjectionAvailable
  ] = useState(false)

  const info: UploadFileInfo = {
    cesiumOptions: {
      srid: isProjectionAvailable ? projection : null,
      verticalSrid: isVerticalProjectionAvailable ? verticalProjection : null,
      isTerrain: isTerrain || null
    },
    category,
    formatType,
    startDateTime,
    endDateTime,
    isSpace
  }

  useEffect(() => {
    if (!isMultiInput) {
      const { info: fileInfo } = fileList[index]
      if (fileInfo) {
        fileInfo.category && setCategory(fileInfo.category)
        fileInfo.formatType && setFormatType(fileInfo.formatType)
        fileInfo.startDateTime && setStartDateTime(fileInfo.startDateTime)
        fileInfo.endDateTime && setEndDateTime(fileInfo.endDateTime)
        fileInfo.isSpace && setIsSpace(fileInfo.isSpace)
        const { cesiumOptions } = fileInfo
        if (cesiumOptions) {
          cesiumOptions.srid && setProjection(cesiumOptions.srid)
          cesiumOptions.verticalSrid &&
            setVerticalProjection(cesiumOptions.verticalSrid)
          cesiumOptions.isTerrain && setIsTerrain(cesiumOptions.isTerrain)
        }
      }
    }
  }, [isMultiInput, fileList, index])

  const checkIsWrongInput = () => {
    if (!fileType) {
      return true
    }
    if (isCategoryAvailable && !category) {
      return true
    }
    if (isFormatTypeAvailable && !formatType) {
      return true
    }

    const isWrongProjection =
      projection !== null &&
      (isNaN(projection) || projection < 1024 || projection > 32767)
    if (isWrongProjection) {
      return true
    }
    const isWrongVerticalProjection =
      verticalProjection !== null &&
      (isNaN(verticalProjection) ||
        verticalProjection < 1024 ||
        verticalProjection > 32767)
    if (isWrongVerticalProjection) {
      return true
    }

    // $FlowFixMe[infererror]
    const isWrongDateInput =
      (startDateTime !== null &&
        endDateTime !== null &&
        startDateTime >= endDateTime) ||
      !!startDateTime ^ !!endDateTime
    if (isWrongDateInput) {
      return true
    }

    return false
  }
  const isWrongInput = checkIsWrongInput()

  return (
    <Modal
      header={() => <ModalHeader headerText={t('fileRegisterModal.title')} />}
      footer={() => (
        <ModalFooter
          leftButton={{
            label: t('fileRegisterModal.buttonLabel.cancel'),
            onClick: () => setModalType(MODAL_TYPE.FILE_LIST)
          }}
          rightButton={{
            disabled: isWrongInput,
            label: t('fileRegisterModal.buttonLabel.input'),
            onClick: () => {
              if (isMultiInput) {
                const indexList = fileList
                  .map(
                    (file, i) =>
                      (getExtension(file.name) === fileType ||
                        (fileType === UNKNOWN_ZIP &&
                          getExtension(file.name) === EXTENSION.ZIP)) &&
                      i
                  )
                  .filter(
                    item =>
                      typeof item === 'number' &&
                      fileList[item].info === undefined
                  )
                // $FlowIgnore[incompatible-call]
                setFilesInfo({ indexList, info })
              } else {
                setFilesInfo({ indexList: [index], info })
              }
              setModalType(MODAL_TYPE.FILE_LIST)
            }
          }}
        />
      )}
      closeButton={false}
      style={{ width: '720px' }}
    >
      {isMultiInput ? (
        <ExtensionSelect
          fileType={fileType}
          fileExtensionList={Array.from(
            new Set(
              fileList
                .filter(filterFile => !filterFile.status)
                .map(mapFile => getExtension(mapFile.name))
            )
          )}
          setFileType={setFileType}
          t={t}
        />
      ) : (
        <FileNameArea>{fileName}</FileNameArea>
      )}
      <CategorySelect
        category={category}
        displayCategoryList={displayCategoryList}
        isCategoryAvailable={isCategoryAvailable}
        setCategory={setCategory}
        t={t}
      />
      <FormatTypeSelect
        file={isMultiInput ? null : fileList[index]}
        formatType={formatType}
        displayFormatTypeList={displayFormatTypeList}
        isFormatTypeAvailable={isFormatTypeAvailable}
        category={category}
        setFormatType={setFormatType}
        setProjectionAvailable={setProjectionAvailable}
        setVerticalProjectionAvailable={setVerticalProjectionAvailable}
        setIsTerrain={setIsTerrain}
        t={t}
      />
      <ProjectionSelect
        isProjectionAvailable={isProjectionAvailable}
        projection={projection}
        setProjection={setProjection}
        setVerticalProjection={setVerticalProjection}
        t={t}
      />
      {/* 座標系(WGS84以外)が選択されている状態のときのみ標高標準を有効にする */}
      {isVerticalProjectionAvailable &&
        projection !== null &&
        projection !== 4326 && (
          <VerticalProjectionSelect
            verticalProjection={verticalProjection}
            setVerticalProjection={setVerticalProjection}
            t={t}
          />
        )}
      {isDtm && <IsSpaceSelect isSpace={isSpace} setIsSpace={setIsSpace} />}
      <TimePeriodSelect
        fromValue={startDateTime}
        toValue={endDateTime}
        // $FlowFixMe[infererror]
        fromOnChange={value => setStartDateTime(new Date(value))}
        // $FlowFixMe[infererror]
        toOnChange={value => setEndDateTime(new Date(value))}
        t={t}
      />
    </Modal>
  )
}

export const FileRegisterModal = React.memo<FileRegisterModalProps>(
  FileRegisterModalComponent
)
