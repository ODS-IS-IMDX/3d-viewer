// Copyright (c) 2025 NTT InfraNet
import React from 'react'
import { Entity as CesiumEntity } from 'cesium'

import CesiumComponent from '../CesiumComponent'
import EntitiesContext from '../EntitiesContext'

export const CLUSTER_DATASOURCE_NAME = {
  ANNOTATION_POINT: 'ANNOTATION_POINT',
  BLACKBOARD: 'BLACKBOARD',
  VIDEO: 'VIDEO'
}

export class Entity extends React.PureComponent {
  constructor (props) {
    super(props)
    this.mount = this.mount.bind(this)
    this.create = this.create.bind(this)
    this.unmount = this.unmount.bind(this)
  }

  create () {
    return new CesiumEntity(this.props)
  }

  mount (entity) {
    if (this.props.entitiesList.getById(entity.id)) {
      this.props.entitiesList.remove(entity)
      this.props.entitiesList.add(entity)
    } else {
      this.props.entitiesList.add(entity)
    }
    /*
     * mountしたentityがもしクラスタ表示が必要であれば、適切なクラスタ表示のEntityCollectionに格納
     * クラスタ表示が必要かどうかの判断条件：
     *   もしthis.props.clusterDataSourceName(クラスタ表示のEntityCollectionの名前)がundefinedではない場合、要クラスタ表示
     */
    const dataSourceName = this.props.clusterDataSourceName
    const viewer = this.props.viewer
    if (
      dataSourceName &&
      viewer.dataSources &&
      this.props.id &&
      !viewer.dataSources
        .getByName(dataSourceName)[0]
        .entities.getById(this.props.id)
    ) {
      viewer.dataSources.getByName(dataSourceName)[0].entities.add(entity)
      // Viewer直下のEntityCollectionに該当entityがあると、クラスタ表示時に該当entityが自動非表示にならない
      viewer.entities.remove(entity)
    }
  }

  unmount (entity) {
    this.props.entitiesList.remove(entity)
    // クラスタ表示対象になる注釈の点のentityを対応するdatasourceから削除
    const dataSourceName = this.props.clusterDataSourceName
    const viewer = this.props.viewer
    if (dataSourceName && viewer.dataSources) {
      viewer.dataSources.getByName(dataSourceName)[0].entities.remove(entity)
    }
    viewer && viewer.scene.requestRender()
  }

  render () {
    return (
      <CesiumComponent
        {...this.props}
        ref={this.props._ref}
        mount={this.mount}
        create={this.create}
        unmount={this.unmount}
        cesiumReadOnlyProps={this.constructor.cesiumReadOnlyProps}
        cesiumProps={this.constructor.cesiumProps}
        cesiumEvents={this.constructor.cesiumEvents}
      />
    )
  }

  componentDidMount () {
    const viewer = this.props.viewer
    viewer && viewer.scene.requestRender()
  }

  componentDidUpdate () {
    const viewer = this.props.viewer
    viewer && viewer.scene.requestRender()
  }
}

Entity.cesiumProps = [
  'availability',
  'billboard',
  'box',
  'corridor',
  'cylinder',
  'description',
  'ellipse',
  'ellipsoid',
  'entityCollection',
  'isShowing',
  'label',
  'model',
  'name',
  'orientation',
  'parent',
  'path',
  'plane',
  'point',
  'polygon',
  'polyline',
  'polylineVolume',
  'position',
  'properties',
  'propertyNames',
  'rectangle',
  'show',
  'viewFrom',
  'wall'
]

Entity.cesiumReadOnlyProps = ['id']

Entity.cesiumEvents = ['definitionChanged']

export const EntityContainer = React.forwardRef((props, ref) => (
  <EntitiesContext.Consumer>
    {entities => <Entity {...props} _ref={ref} entitiesList={entities} />}
  </EntitiesContext.Consumer>
))
