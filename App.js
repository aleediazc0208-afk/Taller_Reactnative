import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const CATEGORIAS = ['Análisis', 'Diseño', 'Código'];

export default function App() {
  // ESTADOS
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tareas, setTareas] = useState([]); // arreglo de objetos {id, titulo, categoria, completada}
  const [aviso, setAviso] = useState('');

  // HU03 + HU04: agregar con validaciones
  const agregarTarea = () => {
    if (titulo.trim() === '') {
      setAviso('Escribe un título para la tarea.');
      Alert.alert('Advertencia', 'Escribe un título para la tarea.');
      return;
    }
    if (categoria === '') {
      setAviso('Selecciona una categoría.');
      Alert.alert('Advertencia', 'Selecciona una categoría.');
      return;
    }
    const nueva = {
      id: Date.now().toString(),
      titulo: titulo.trim(),
      categoria: categoria,
      completada: false, // estado inicial: Pendiente
    };
    setTareas([...tareas, nueva]);
    setTitulo('');
    setCategoria('');
    setAviso('');
  };

  // HU06: alternar estado
  const cambiarEstado = (id) => {
    setTareas(
      tareas.map((t) =>
        t.id === id ? { ...t, completada: !t.completada } : t
      )
    );
  };

  // HU07: eliminar
  const eliminarTarea = (id) => {
    setTareas(tareas.filter((t) => t.id !== id));
  };

  // HU08: indicadores calculados desde el arreglo
  const total = tareas.length;
  const completadas = tareas.filter((t) => t.completada).length;
  const pendientes = total - completadas;

  // Cada tarea de la lista
  const renderTarea = ({ item }) => (
    <View style={[styles.card, item.completada && styles.cardCompletada]}>
      <View style={styles.cardInfo}>
        <Text
          style={[styles.cardTitulo, item.completada && styles.tachado]}
        >
          {item.titulo}
        </Text>
        <Text style={styles.cardTexto}>Categoría: {item.categoria}</Text>
        <Text
          style={[
            styles.estado,
            item.completada ? styles.estadoOk : styles.estadoPend,
          ]}
        >
          {item.completada ? 'Completada' : 'Pendiente'}
        </Text>
      </View>
      <View style={styles.acciones}>
        <TouchableOpacity
          style={[styles.btnAccion, styles.btnEstado]}
          onPress={() => cambiarEstado(item.id)}
        >
          <Text style={styles.btnAccionTxt}>
            {item.completada ? 'Reabrir' : 'Completar'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnAccion, styles.btnEliminar]}
          onPress={() => eliminarTarea(item.id)}
        >
          <Text style={styles.btnAccionTxt}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#39A900" />

      {/* HU01: identidad */}
      <View style={styles.header}>
        <Text style={styles.appNombre}>Mi Sprint ADSO</Text>
        <Text style={styles.headerTxt}>Aprendiz: Michell Alexandra Diaz Correa</Text>
        <Text style={styles.headerTxt}>Ficha: 3409609</Text>
      </View>

      {/* HU08: resumen */}
      <View style={styles.resumen}>
        <View style={styles.indicador}>
          <Text style={styles.indNum}>{total}</Text>
          <Text style={styles.indLbl}>Total</Text>
        </View>
        <View style={styles.indicador}>
          <Text style={[styles.indNum, { color: '#E67E22' }]}>{pendientes}</Text>
          <Text style={styles.indLbl}>Pendientes</Text>
        </View>
        <View style={styles.indicador}>
          <Text style={[styles.indNum, { color: '#39A900' }]}>{completadas}</Text>
          <Text style={styles.indLbl}>Completadas</Text>
        </View>
      </View>

      {/* HU02: formulario */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Título de la tarea"
          value={titulo}
          onChangeText={(texto) => {
            setTitulo(texto);
            setAviso('');
          }}
        />
        <View style={styles.categorias}>
          {CATEGORIAS.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, categoria === cat && styles.chipActivo]}
              onPress={() => {
                setCategoria(cat);
                setAviso('');
              }}
            >
              <Text
                style={[
                  styles.chipTxt,
                  categoria === cat && styles.chipTxtActivo,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {aviso !== '' && <Text style={styles.aviso}>{aviso}</Text>}
        <TouchableOpacity style={styles.btnAgregar} onPress={agregarTarea}>
          <Text style={styles.btnAgregarTxt}>Agregar tarea</Text>
        </TouchableOpacity>
      </View>

      {/* HU05: lista */}
      <FlatList
        data={tareas}
        keyExtractor={(item) => item.id}
        renderItem={renderTarea}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <Text style={styles.vacio}>Todavía no hay tareas registradas.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8' },
  header: {
    backgroundColor: '#39A900',
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingTop: 36,
  },
  appNombre: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  headerTxt: { color: '#fff', fontSize: 14, marginTop: 2 },

  resumen: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    margin: 12,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 2,
  },
  indicador: { alignItems: 'center' },
  indNum: { fontSize: 26, fontWeight: 'bold', color: '#333' },
  indLbl: { fontSize: 12, color: '#666' },

  form: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    padding: 12,
    borderRadius: 12,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 15,
  },
  categorias: { flexDirection: 'row', marginTop: 10 },
  chip: {
    borderWidth: 1,
    borderColor: '#39A900',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  chipActivo: { backgroundColor: '#39A900' },
  chipTxt: { color: '#39A900', fontWeight: '600' },
  chipTxtActivo: { color: '#fff' },
  aviso: { color: '#C0392B', marginTop: 8 },
  btnAgregar: {
    backgroundColor: '#00304D',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  btnAgregarTxt: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

  lista: { padding: 12, paddingBottom: 40 },
  vacio: { textAlign: 'center', color: '#888', marginTop: 20, fontSize: 15 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 5,
    borderLeftColor: '#E67E22',
    elevation: 2,
  },
  cardCompletada: { borderLeftColor: '#39A900', backgroundColor: '#EAF7E3' },
  cardInfo: { flex: 1, paddingRight: 8 },
  cardTitulo: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  tachado: { textDecorationLine: 'line-through', color: '#777' },
  cardTexto: { fontSize: 13, color: '#555', marginTop: 2 },
  estado: { fontSize: 13, fontWeight: 'bold', marginTop: 4 },
  estadoOk: { color: '#39A900' },
  estadoPend: { color: '#E67E22' },
  acciones: { justifyContent: 'center' },
  btnAccion: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginVertical: 2,
    alignItems: 'center',
  },
  btnEstado: { backgroundColor: '#39A900' },
  btnEliminar: { backgroundColor: '#C0392B' },
  btnAccionTxt: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});